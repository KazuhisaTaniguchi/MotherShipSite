<?php
/* Plugin Name: WP-PostViews
   Plugin URI: http://lesterchan.net/portfolio/programming/php/
   Description: Enables you to display how many times a post/page had been viewed.
   Version: 1.67
   Author: Lester 'GaMerZ' Chan
   Author URI: http://lesterchan.net
* ---------------------------------------- */


/* Copyright 2014  Lester Chan  (email : lesterchan@gmail.com)

     This program is free software; you can redistribute it and/or modify
     it under the terms of the GNU General Public License as published by
     the Free Software Foundation; either version 2 of the License, or
     (at your option) any later version.

     This program is distributed in the hope that it will be useful,
     but WITHOUT ANY WARRANTY; without even the implied warranty of
     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
     GNU General Public License for more details.

     You should have received a copy of the GNU General Public License
     along with this program; if not, write to the Free Software
     Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
* ---------------------------------------- */

/* Create Text Domain For Translations
* ---------------------------------------- */
add_action( 'plugins_loaded', 'bzb_postviews_textdomain' );
function bzb_postviews_textdomain() {
  load_plugin_textdomain( 'xeory_base', false, dirname( plugin_basename( __FILE__ ) ) );
}


// ### Function: Post Views Option Menu
// add_action('admin_menu', 'postviews_menu');
// function postviews_menu() {
//   if (function_exists('add_options_page')) {
//     add_options_page(__('PostViews', 'xeory_base'), __('PostViews', 'xeory_base'), 'manage_options', 'wp-postviews/postviews-options.php') ;
//   }
// }


/* Function: Get Post Views Count Mode
 * 'off'  : PVカウントを行わない（管理画面で無効化）
 * 'sync' : ページ表示時にカウントする（use_ajax = 0 の場合のみ）
 * 'ajax' : Ajaxで非同期にカウントする（デフォルト）
* ---------------------------------------- */
function bzb_postviews_mode() {
  if( get_option( 'postviews_disabled' ) ) {
    return 'off';
  }
  $views_options = get_option( 'views_options' );
  if( isset( $views_options['use_ajax'] ) && intval( $views_options['use_ajax'] ) === 0 ) {
    return 'sync';
  }
  return 'ajax';
}


/* Function: Determine If Current Request Is From A Bot
* ---------------------------------------- */
function bzb_postviews_is_bot( $views_options = null ) {
  if( $views_options === null ) {
    $views_options = get_option( 'views_options' );
  }
  if( !isset( $views_options['exclude_bots'] ) || intval( $views_options['exclude_bots'] ) !== 1 ) {
    return false;
  }
  if( empty( $_SERVER['HTTP_USER_AGENT'] ) ) {
    return false;
  }
  $bots = array
  (
      'Google Bot' => 'googlebot'
    , 'Google Bot' => 'google'
    , 'MSN' => 'msnbot'
    , 'Alex' => 'ia_archiver'
    , 'Lycos' => 'lycos'
    , 'Ask Jeeves' => 'jeeves'
    , 'Altavista' => 'scooter'
    , 'AllTheWeb' => 'fast-webcrawler'
    , 'Inktomi' => 'slurp@inktomi'
    , 'Turnitin.com' => 'turnitinbot'
    , 'Technorati' => 'technorati'
    , 'Yahoo' => 'yahoo'
    , 'Findexa' => 'findexa'
    , 'NextLinks' => 'findlinks'
    , 'Gais' => 'gaisbo'
    , 'WiseNut' => 'zyborg'
    , 'WhoisSource' => 'surveybot'
    , 'Bloglines' => 'bloglines'
    , 'BlogSearch' => 'blogsearch'
    , 'PubSub' => 'pubsub'
    , 'Syndic8' => 'syndic8'
    , 'RadioUserland' => 'userland'
    , 'Gigabot' => 'gigabot'
    , 'Become.com' => 'become.com'
    , 'Baidu' => 'baiduspider'
    , 'so.com' => '360spider'
    , 'Sogou' => 'spider'
    , 'soso.com' => 'sosospider'
    , 'Yandex' => 'yandex'
  );
  $useragent = $_SERVER['HTTP_USER_AGENT'];
  foreach ( $bots as $name => $lookfor ) {
    if ( stristr( $useragent, $lookfor ) !== false ) {
      return true;
    }
  }
  return false;
}


/* Function: Post Views Buffer
 * 閲覧ごとにDBへ書き込まず、uploads 内のファイルに post_id を追記しておき、
 * WP-Cron（5分ごと）でまとめて postmeta に反映する。
 * uploads に書き込めない環境では、従来どおり直接DBへ書き込む。
* ---------------------------------------- */
define( 'BZB_POSTVIEWS_FLUSH_INTERVAL', 5 * MINUTE_IN_SECONDS );
define( 'BZB_POSTVIEWS_FLUSH_FALLBACK', 15 * MINUTE_IN_SECONDS );

function bzb_postviews_buffer_dir() {
  static $dir = null;
  if( $dir !== null ) {
    return $dir;
  }
  $dir = false;
  if( !apply_filters( 'bzb_postviews_use_buffer', true ) ) {
    return $dir;
  }
  $upload_dir = wp_upload_dir( null, false );
  if( !empty( $upload_dir['error'] ) ) {
    return $dir;
  }
  $path = trailingslashit( $upload_dir['basedir'] ) . 'xeory-postviews';
  if( !is_dir( $path ) ) {
    if( !wp_mkdir_p( $path ) ) {
      return $dir;
    }
    // 直接アクセスされても中身を見られないようにする
    @file_put_contents( $path . '/index.php', "<?php\n// Silence is golden.\n" );
    @file_put_contents( $path . '/.htaccess', "<IfModule mod_authz_core.c>\nRequire all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\nDeny from all\n</IfModule>\n" );
  }
  if( wp_is_writable( $path ) ) {
    $dir = $path;
  }
  return $dir;
}

function bzb_postviews_buffer_file() {
  $dir = bzb_postviews_buffer_dir();
  if( !$dir ) {
    return false;
  }
  // .htaccess が効かない環境（Nginx等）でもURLを推測されないよう、ファイル名をランダムにする
  $key = get_option( 'bzb_postviews_buffer_key' );
  if( !$key ) {
    $key = wp_generate_password( 20, false );
    update_option( 'bzb_postviews_buffer_key', $key );
  }
  return $dir . '/views-' . $key . '.log';
}

/* Function: Add Post Views To postmeta Directly
* ---------------------------------------- */
function bzb_postviews_increment_meta( $post_id, $count = 1 ) {
  global $wpdb;
  $post_id = intval( $post_id );
  $count   = intval( $count );
  if( $post_id <= 0 || $count <= 0 ) {
    return;
  }
  // 読み出してから書き戻すと同時アクセスでカウントが抜けるため、SQLで加算する
  $updated = $wpdb->query( $wpdb->prepare(
    "UPDATE {$wpdb->postmeta} SET meta_value = meta_value + %d WHERE post_id = %d AND meta_key = 'views'",
    $count, $post_id
  ) );
  if( !$updated ) {
    add_post_meta( $post_id, 'views', $count, true );
  }
  wp_cache_delete( $post_id, 'post_meta' );
}

/* Function: Count A Post View
* ---------------------------------------- */
function bzb_postviews_add_view( $post_id ) {
  $post_id = intval( $post_id );
  if( $post_id <= 0 ) {
    return;
  }
  $file = bzb_postviews_buffer_file();
  if( !$file || @file_put_contents( $file, $post_id . "\n", FILE_APPEND | LOCK_EX ) === false ) {
    bzb_postviews_increment_meta( $post_id );
    return;
  }
  // WP-Cron が動いていない環境向けの保険：一定時間反映されていなければその場で反映する
  $marker = bzb_postviews_buffer_dir() . '/last-flush';
  if( !file_exists( $marker ) ) {
    @touch( $marker );
  } elseif( filemtime( $marker ) < time() - BZB_POSTVIEWS_FLUSH_FALLBACK ) {
    bzb_postviews_flush_buffer();
  }
}

/* Function: Flush Post Views Buffer To postmeta
* ---------------------------------------- */
add_action( 'bzb_postviews_flush', 'bzb_postviews_flush_buffer' );
function bzb_postviews_flush_buffer() {
  $dir  = bzb_postviews_buffer_dir();
  $file = bzb_postviews_buffer_file();
  if( !$dir || !$file ) {
    return;
  }
  // 同時に複数の反映処理が走って二重にカウントしないようにロックする
  $lock = @fopen( $dir . '/.lock', 'c' );
  if( !$lock ) {
    return;
  }
  if( !flock( $lock, LOCK_EX | LOCK_NB ) ) {
    fclose( $lock );
    return;
  }
  @touch( $dir . '/last-flush' );

  // 反映中に届いた閲覧は新しいバッファに書かれるよう、先にリネームしてから集計する
  if( file_exists( $file ) ) {
    @rename( $file, $file . '.' . uniqid() . '.processing' );
  }
  // 前回途中で止まった分も含めて処理する
  $processing = glob( $file . '.*.processing' );
  if( $processing ) {
    foreach( $processing as $target ) {
      $ids = @file( $target, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES );
      if( $ids ) {
        $counts = array_count_values( array_map( 'intval', $ids ) );
        foreach( $counts as $post_id => $count ) {
          bzb_postviews_increment_meta( $post_id, $count );
        }
      }
      @unlink( $target );
    }
  }

  flock( $lock, LOCK_UN );
  fclose( $lock );
}

/* Function: Schedule Post Views Flush
* ---------------------------------------- */
add_filter( 'cron_schedules', 'bzb_postviews_cron_schedules' );
function bzb_postviews_cron_schedules( $schedules ) {
  $schedules['bzb_postviews_interval'] = array(
    'interval' => BZB_POSTVIEWS_FLUSH_INTERVAL,
    'display'  => 'PV数の反映（5分ごと）',
  );
  return $schedules;
}

// テーマには有効化フックが無いため、未登録なら登録する（FTPでの上書きや子テーマでも確実に登録される）
add_action( 'init', 'bzb_postviews_schedule_flush' );
function bzb_postviews_schedule_flush() {
  if( !wp_next_scheduled( 'bzb_postviews_flush' ) ) {
    wp_schedule_event( time() + BZB_POSTVIEWS_FLUSH_INTERVAL, 'bzb_postviews_interval', 'bzb_postviews_flush' );
  }
}

// テーマ切替時は溜まっている分を反映してからスケジュールを解除する
add_action( 'switch_theme', 'bzb_postviews_unschedule_flush' );
function bzb_postviews_unschedule_flush() {
  bzb_postviews_flush_buffer();
  wp_clear_scheduled_hook( 'bzb_postviews_flush' );
}


/* Function: Calculate Post Views
* ---------------------------------------- */
add_action( 'wp_head', 'bzb_process_postviews' );
function bzb_process_postviews() {
  global $user_ID, $post;
  if( bzb_postviews_mode() !== 'sync' ) {
    return;
  }
  if( is_int( $post ) ) {
    $post = get_post( $post );
  }
  if( !wp_is_post_revision( $post ) ) {
    if( is_single() || is_page() ) {
      $id = intval( $post->ID );
      $views_options = get_option( 'views_options' );
      $should_count = false;
      if(isset($views_options['count']))
      switch( intval( $views_options['count'] ) ) {
        case 0:
          $should_count = true;
          break;
        case 1:
          if(empty( $_COOKIE[USER_COOKIE] ) && intval( $user_ID ) === 0) {
            $should_count = true;
          }
          break;
        case 2:
          if( intval( $user_ID ) > 0 ) {
            $should_count = true;
          }
          break;
      }

      if( bzb_postviews_is_bot( $views_options ) ) {
        $should_count = false;
      }
      if( $should_count ) {
        bzb_postviews_add_view( $id );
      }
    }
  }
}


/* Function: Calculate Post Views With Ajax
* ---------------------------------------- */
add_action('wp_enqueue_scripts', 'bzb_wp_postview_cache_count_enqueue');
function bzb_wp_postview_cache_count_enqueue() {
  global $user_ID, $post;

  if( bzb_postviews_mode() !== 'ajax' ){
    return;
  }

  $views_options = get_option( 'views_options' );

  if ( !wp_is_post_revision( $post ) && ( is_single() || is_page() ) ) {
    $should_count = false;
    if( isset( $views_options['count'] ) )
    switch( intval( $views_options['count'] ) ) {
      case 0:
        $should_count = true;
        break;
      case 1:
        if ( empty( $_COOKIE[USER_COOKIE] ) && intval( $user_ID ) === 0) {
          $should_count = true;
        }
        break;
      case 2:
        if ( intval( $user_ID ) > 0 ) {
          $should_count = true;
        }
        break;
    }
    if ( bzb_postviews_is_bot( $views_options ) ) {
      $should_count = false;
    }
    if ( $should_count ) {
      wp_enqueue_script( 'wp-postviews-cache', get_template_directory_uri() . '/lib/js/postviews-cache.js', array( 'jquery' ), '1.67', true );
      wp_localize_script( 'wp-postviews-cache', 'viewsCacheL10n', array( 'admin_ajax_url' => admin_url( 'admin-ajax.php', ( is_ssl() ? 'https' : 'http' ) ), 'post_id' => intval( $post->ID ) ) );
    }
  }
}


/* Function: Determine If Post Views Should Be Displayed (By: David Potter)
* ---------------------------------------- */
function bzb_should_views_be_displayed($views_options = null) {
  if ( $views_options == null ) {
    $views_options = get_option('views_options');
  }
  $display_option = 0;
  if ( is_home() ) {
    if ( array_key_exists('display_home', $views_options) ) {
      $display_option = $views_options['display_home'];
    }
  } elseif ( is_single() ) {
    if ( array_key_exists('display_single', $views_options) ) {
      $display_option = $views_options['display_single'];
    }
  } elseif ( is_page() ) {
    if ( array_key_exists('display_page', $views_options) ) {
      $display_option = $views_options['display_page'];
    }
  } elseif ( is_archive() ) {
    if ( array_key_exists('display_archive', $views_options) ) {
      $display_option = $views_options['display_archive'];
    }
  } elseif ( is_search() ) {
    if ( array_key_exists('display_search', $views_options) ) {
      $display_option = $views_options['display_search'];
    }
  } else {
    if ( array_key_exists('display_other', $views_options) ) {
      $display_option = $views_options['display_other'];
    }
  }
  return (($display_option == 0) || (($display_option == 1) && is_user_logged_in()));
}


/* Function: Display The Post Views
* ---------------------------------------- */
function bzb_the_views($display = true, $prefix = '', $postfix = '', $always = false) {
  $post_views = intval(post_custom('views'));
  $views_options = get_option('views_options');
  if ($always || bzb_should_views_be_displayed($views_options)) {
  	if(isset($views_options['template']))
    $output = $prefix.str_replace('%VIEW_COUNT%', number_format_i18n($post_views), $views_options['template']).$postfix;
    //$output = $prefix.str_replace('%VIEW_COUNT%', number_format_i18n($post_views), $views_options['template']).$postfix;
    if($display) {
      echo apply_filters('bzb_the_views', number_format_i18n($post_views));
//      echo apply_filters('bzb_the_views', $output);
    } else {
      return apply_filters('bzb_the_views', $output);
      //return apply_filters('the_views', $output);
    }
  }elseif (!$display) {
    return '';
  }
}


/* Function: Display Most Viewed Page/Post Views
* ---------------------------------------- */
if(!function_exists('bzb_get_most_viewed')) {
  function bzb_get_most_viewed($mode = '', $limit = 10, $chars = 0, $display = true, $disp_views = 0) {
    global $wpdb;
    $views_options = get_option('views_options');
    $where = '';
    $temp = '';
    $output = '';
    if( !empty($mode) && $mode != 'both' ) {
      if( is_array($mode) ) {
        $mode = implode("','",$mode);
        $where = "post_type IN ('".$mode."')";
      } else {
        $where = "post_type = '$mode'";
      }
    } else {
      $where = '1=1';
    }
    $most_viewed = $wpdb->get_results("SELECT DISTINCT $wpdb->posts.*, (meta_value+0) AS views FROM $wpdb->posts LEFT JOIN $wpdb->postmeta ON $wpdb->postmeta.post_id = $wpdb->posts.ID WHERE post_date < '".current_time('mysql')."' AND $where AND post_status = 'publish' AND meta_key = 'views' AND post_password = '' ORDER BY views DESC LIMIT $limit");
    if( $most_viewed ) {
      foreach ( $most_viewed as $post ) {
        $post_views = intval($post->views);
        $post_title = get_the_title($post);
        if( $chars > 0 ) {
          $post_title = bzb_snippet_text($post_title, $chars);
        }
        $post_excerpt = bzb_views_post_excerpt($post->post_excerpt, $post->post_content, $post->post_password, $chars);
        if( $disp_views ){
          $temp = stripslashes($views_options['most_viewed_template']);
        }else{
          $temp = '<li><a href="%POST_URL%"  title="%POST_TITLE%"　>%POST_TITLE%</a></li>';
        }
        //jump
        $temp = str_replace("%VIEW_COUNT%", number_format_i18n($post_views) , $temp);
        //echo $temp;
        $temp = str_replace("%POST_TITLE%", $post_title, $temp);
        $temp = str_replace("%POST_EXCERPT%", $post_excerpt, $temp);
        $temp = str_replace("%POST_CONTENT%", $post->post_content, $temp);
        $temp = str_replace("%POST_URL%", get_permalink($post), $temp);
        $temp = str_replace("%POST_DATE%", get_the_time(get_option('date_format'), $post), $temp);
        $temp = str_replace("%POST_TIME%", get_the_time(get_option('time_format'), $post), $temp);
        $output .= $temp;
      }
    } else {
      $output = '<li>'.__('N/A', 'xeory_base').'</li>'."\n";
    }
    if( $display ) {
      echo $output;
    } else {
      return $output;
    }
  }
}


/* Function: Display Total Views
* ---------------------------------------- */
if( !function_exists('bzb_get_totalviews') ) {
  function bzb_get_totalviews($display = true) {
    global $wpdb;
    $total_views = intval($wpdb->get_var("SELECT SUM(meta_value+0) FROM $wpdb->postmeta WHERE meta_key = 'views'"));
    if( $display ) {
      echo number_format_i18n($total_views);
    } else {
      return $total_views;
    }
  }
}


/* Function: Snippet Text
* ---------------------------------------- */
if( !function_exists('bzb_snippet_text') ) {
  function bzb_snippet_text($text, $length = 0) {
    if ( defined('MB_OVERLOAD_STRING') ) {
      $text = @html_entity_decode($text, ENT_QUOTES, get_option('blog_charset'));
      if ( mb_strlen($text) > $length ) {
        return htmlentities(mb_substr($text,0,$length), ENT_COMPAT, get_option('blog_charset')).'...';
      } else {
        return htmlentities($text, ENT_COMPAT, get_option('blog_charset'));
      }
    } else {
      $text = @html_entity_decode($text, ENT_QUOTES, get_option('blog_charset'));
      if ( strlen($text) > $length ) {
        return htmlentities(substr($text,0,$length), ENT_COMPAT, get_option('blog_charset')).'...';
      } else {
        return htmlentities($text, ENT_COMPAT, get_option('blog_charset'));
      }
    }
  }
}


/* Function: Process Post Excerpt, For Some Reasons, The Default get_post_excerpt() Does Not Work As Expected
* ---------------------------------------- */
function bzb_views_post_excerpt($post_excerpt, $post_content, $post_password, $chars = 200) {
  if( !empty($post_password) ) {
    if( !isset($_COOKIE['wp-postpass_'.COOKIEHASH]) || $_COOKIE['wp-postpass_'.COOKIEHASH] != $post_password ) {
      return __('There is no excerpt because this is a protected post.', 'xeory_base');
    }
  }
  if( empty($post_excerpt) ) {
    return bzb_snippet_text(strip_tags($post_content), $chars);
  } else {
    return $post_excerpt;
  }
}


/* Function: Modify Default WordPress Listing To Make It Sorted By Post Views
* ---------------------------------------- */
function bzb_views_fields($content) {
  global $wpdb;
  $content .= ", ($wpdb->postmeta.meta_value+0) AS views";
  return $content;
}
function bzb_views_join($content) {
  global $wpdb;
  $content .= " LEFT JOIN $wpdb->postmeta ON $wpdb->postmeta.post_id = $wpdb->posts.ID";
  return $content;
}
function bzb_views_where($content) {
  global $wpdb;
  $content .= " AND $wpdb->postmeta.meta_key = 'views'";
  return $content;
}
function bzb_views_orderby($content) {
  $orderby = trim(addslashes(get_query_var('v_orderby')));
  if( empty($orderby) || ($orderby != 'asc' && $orderby != 'desc') ) {
    $orderby = 'desc';
  }
  $content = " views $orderby";
  return $content;
}


/* Function: Add Views Custom Fields
* ---------------------------------------- */
add_action('publish_post', 'bzb_add_views_fields');
add_action('publish_page', 'bzb_add_views_fields');
function bzb_add_views_fields($post_ID) {
  global $wpdb;
  if( !wp_is_post_revision($post_ID) ) {
    add_post_meta($post_ID, 'views', 0, true);
  }
}


/* Function: Delete Views Custom Fields
* ---------------------------------------- */
add_action('delete_post', 'bzb_delete_views_fields');
function bzb_delete_views_fields($post_ID) {
  global $wpdb;
  if( !wp_is_post_revision($post_ID) ) {
    delete_post_meta($post_ID, 'views');
  }
}


/* Function: Views Public Variables
* ---------------------------------------- */
add_filter('query_vars', 'bzb_views_variables');
function bzb_views_variables($public_query_vars) {
  $public_query_vars[] = 'v_sortby';
  $public_query_vars[] = 'v_orderby';
  return $public_query_vars;
}


/* Function: Sort Views Posts
* ---------------------------------------- */
add_action('pre_get_posts', 'bzb_views_sorting');
function bzb_views_sorting($local_wp_query) {
  if( $local_wp_query->get('v_sortby') == 'views' ) {
    add_filter('posts_fields', 'bzb_views_fields');
    add_filter('posts_join', 'bzb_views_join');
    add_filter('posts_where', 'bzb_views_where');
    add_filter('posts_orderby', 'bzb_views_orderby');
  } else {
    remove_filter('posts_fields', 'bzb_views_fields');
    remove_filter('posts_join', 'bzb_views_join');
    remove_filter('posts_where', 'bzb_views_where');
    remove_filter('posts_orderby', 'bzb_views_orderby');
  }
}


/* Function: Plug Into WP-Stats
* ---------------------------------------- */
add_action('wp','bzb_postviews_wp_stats');
function bzb_postviews_wp_stats() {
  if( function_exists('stats_page') ) {
    if( strpos(get_option('stats_url'), $_SERVER['REQUEST_URI']) || strpos($_SERVER['REQUEST_URI'], 'stats-options.php') || strpos($_SERVER['REQUEST_URI'], 'wp-stats/wp-stats.php') ) {
      add_filter('wp_stats_page_admin_plugins', 'bzb_postviews_page_admin_general_stats');
      add_filter('wp_stats_page_admin_most', 'bzb_postviews_page_admin_most_stats');
      add_filter('wp_stats_page_plugins', 'bzb_postviews_page_general_stats');
      add_filter('wp_stats_page_most', 'bzb_postviews_page_most_stats');
    }
  }
}


/* Function: Add WP-PostViews General Stats To WP-Stats Page Options
* ---------------------------------------- */
function bzb_postviews_page_admin_general_stats($content) {
  $stats_display = get_option('stats_display');
  if( $stats_display['views'] == 1 ) {
    $content .= '<input type="checkbox" name="stats_display[]" id="wpstats_views" value="views" checked="checked" />&nbsp;&nbsp;<label for="wpstats_views">'.__('WP-PostViews', 'xeory_base').'</label><br />'."\n";
  } else {
    $content .= '<input type="checkbox" name="stats_display[]" id="wpstats_views" value="views" />&nbsp;&nbsp;<label for="wpstats_views">'.__('WP-PostViews', 'xeory_base').'</label><br />'."\n";
  }
  return $content;
}


/* Function: Add WP-PostViews Top Most/Highest Stats To WP-Stats Page Options
* ---------------------------------------- */
function bzb_postviews_page_admin_most_stats($content) {
  $stats_display = get_option('stats_display');
  $stats_mostlimit = intval(get_option('stats_mostlimit'));
  if( $stats_display['viewed_most_post'] == 1 ) {
    $content .= '<input type="checkbox" name="stats_display[]" id="wpstats_viewed_most_post" value="viewed_most_post" checked="checked" />&nbsp;&nbsp;<label for="wpstats_viewed_most_post">'.sprintf(_n('%s Most Viewed Post', '%s Most Viewed Posts', $stats_mostlimit, 'xeory_base'), number_format_i18n($stats_mostlimit)).'</label><br />'."\n";
  } else {
    $content .= '<input type="checkbox" name="stats_display[]" id="wpstats_viewed_most_post" value="viewed_most_post" />&nbsp;&nbsp;<label for="wpstats_viewed_most_post">'.sprintf(_n('%s Most Viewed Post', '%s Most Viewed Posts', $stats_mostlimit, 'xeory_base'), number_format_i18n($stats_mostlimit)).'</label><br />'."\n";
  }
  if( $stats_display['viewed_most_page'] == 1 ) {
    $content .= '<input type="checkbox" name="stats_display[]" id="wpstats_viewed_most_page" value="viewed_most_page" checked="checked" />&nbsp;&nbsp;<label for="wpstats_viewed_most_page">'.sprintf(_n('%s Most Viewed Page', '%s Most Viewed Pages', $stats_mostlimit, 'xeory_base'), number_format_i18n($stats_mostlimit)).'</label><br />'."\n";
  } else {
    $content .= '<input type="checkbox" name="stats_display[]" id="wpstats_viewed_most_page" value="viewed_most_page" />&nbsp;&nbsp;<label for="wpstats_viewed_most_page">'.sprintf(_n('%s Most Viewed Page', '%s Most Viewed Pages', $stats_mostlimit, 'xeory_base'), number_format_i18n($stats_mostlimit)).'</label><br />'."\n";
  }
  return $content;
}


/* Function: Add WP-PostViews General Stats To WP-Stats Page
* ---------------------------------------- */
function bzb_postviews_page_general_stats($content) {
  $stats_display = get_option('stats_display');
  if( $stats_display['views'] == 1 ) {
    $content .= '<p><strong>'.__('WP-PostViews', 'xeory_base').'</strong></p>'."\n";
    $content .= '<ul>'."\n";
    $content .= '<li>'.sprintf(_n('<strong>%s</strong> view was generated.', '<strong>%s</strong> views were generated.', get_totalviews(false), 'xeory_base'), number_format_i18n(get_totalviews(false))).'</li>'."\n";
    $content .= '</ul>'."\n";
  }
  return $content;
}


/* Function: Add WP-PostViews Top Most/Highest Stats To WP-Stats Page
* ---------------------------------------- */
function bzb_postviews_page_most_stats($content) {
  $stats_display = get_option('stats_display');
  $stats_mostlimit = intval(get_option('stats_mostlimit'));
  if( $stats_display['viewed_most_post'] == 1 ) {
    $content .= '<p><strong>'.sprintf(_n('%s Most Viewed Post', '%s Most Viewed Posts', $stats_mostlimit, 'xeory_base'), number_format_i18n($stats_mostlimit)).'</strong></p>'."\n";
    $content .= '<ul>'."\n";
    $content .= bzb_get_most_viewed('post', $stats_mostlimit, 0, false);
    $content .= '</ul>'."\n";
  }
  if( $stats_display['viewed_most_page'] == 1 ) {
    $content .= '<p><strong>'.sprintf(_n('%s Most Viewed Page', '%s Most Viewed Pages', $stats_mostlimit, 'xeory_base'), number_format_i18n($stats_mostlimit)).'</strong></p>'."\n";
    $content .= '<ul>'."\n";
    $content .= bzb_get_most_viewed('page', $stats_mostlimit, 0, false);
    $content .= '</ul>'."\n";
  }
  return $content;
}


/* Function: Increment Post Views
* ---------------------------------------- */
add_action( 'wp_ajax_postviews', 'bzb_increment_views' );
add_action( 'wp_ajax_nopriv_postviews', 'bzb_increment_views' );
function bzb_increment_views() {
  if( empty( $_GET['postviews_id'] ) )
    return;

  if( bzb_postviews_mode() !== 'ajax' )
    return;

  if( bzb_postviews_is_bot() )
    return;

  $post_id = intval( $_GET['postviews_id'] );
  if( $post_id > 0 && get_post_status( $post_id ) === 'publish' ) {
    bzb_postviews_add_view( $post_id );
    exit();
  }
}


/* Function Show Post Views Column in WP-Admin
* ---------------------------------------- */
add_action('manage_posts_custom_column', 'bzb_add_postviews_column_content');
add_filter('manage_posts_columns', 'bzb_add_postviews_column');
add_action('manage_pages_custom_column', 'bzb_add_postviews_column_content');
add_filter('manage_pages_columns', 'bzb_add_postviews_column');
function bzb_add_postviews_column($defaults) {
  $defaults['views'] = __( 'Views', 'xeory_base' );
  return $defaults;
}


/* Functions Fill In The Views Count
* ---------------------------------------- */
function bzb_add_postviews_column_content($column_name) {
    if( $column_name == 'views' ) {
        if( function_exists('bzb_the_views') ) { bzb_the_views(true, '', '', true); }
    }
}


/* Function Sort Columns
* ---------------------------------------- */
add_filter('manage_edit-post_sortable_columns', 'bzb_sort_postviews_column');
add_filter('manage_edit-page_sortable_columns', 'bzb_sort_postviews_column');
function bzb_sort_postviews_column($defaults){
  $defaults['views'] = 'views';
  return $defaults;
}
add_action('pre_get_posts', 'bzb_sort_postviews');
function bzb_sort_postviews($query) {
  if( !is_admin() ){
    return;
  }
  $orderby = $query->get('orderby');
  if( 'views' == $orderby ) {
    $query->set('meta_key', 'views');
    $query->set('orderby', 'meta_value_num');
  }
}


/* Class: WP-PostViews Widget
* ---------------------------------------- */
class WP_Widget_PostViews_bzb extends WP_Widget {
  // Constructor
  function __construct() {
    $widget_ops = array('description' => __('WP-PostViews views statistics', 'xeory_base'));
    parent::__construct('views', __('ページビュー数', 'xeory_base'), $widget_ops);
  }

  // Display Widget
  function widget($args, $instance) {
    extract($args);
    $title = apply_filters('widget_title', esc_attr($instance['title']));
    $type = esc_attr($instance['type']);
    $mode = esc_attr($instance['mode']);
    $limit = intval($instance['limit']);
    $chars = intval($instance['chars']);
    $cat_ids = explode(',', esc_attr($instance['cat_ids']));
    $disp_views = intval($instance['disp_views']);
    echo $before_widget.$before_title.$title.$after_title;
    echo '<ul>'."\n";
    switch($type) {
      case 'most_viewed':
        bzb_get_most_viewed($mode, $limit, $chars,true, $disp_views);//jumps
        break;
      case 'most_viewed_category':
        bzb_get_most_viewed_category($cat_ids, $mode, $limit, $chars);
        break;
    }
    echo '</ul>'."\n";
    echo $after_widget;
  }

  // When Widget Control Form Is Posted
  function update($new_instance, $old_instance) {
    if ( !isset($new_instance['submit']) ) {
      return false;
    }
    $instance = $old_instance;
    $instance['title'] = strip_tags($new_instance['title']);
    $instance['type'] = strip_tags($new_instance['type']);
    $instance['mode'] = strip_tags($new_instance['mode']);
    $instance['limit'] = intval($new_instance['limit']);
    $instance['chars'] = intval($new_instance['chars']);
    $instance['cat_ids'] = strip_tags($new_instance['cat_ids']);
    $instance['disp_views'] = strip_tags($new_instance['disp_views']);
    return $instance;
  }

  // DIsplay Widget Control Form
  function form($instance) {
    $instance = wp_parse_args((array) $instance, array('title' => __('Views', 'xeory_base'), 'type' => 'most_viewed', 'mode' => 'both', 'limit' => 10, 'chars' => 200, 'cat_ids' => '0', 'disp_views' => 0));
    $title = esc_attr($instance['title']);
    $type = esc_attr($instance['type']);
    $mode = esc_attr($instance['mode']);
    $limit = intval($instance['limit']);
    $chars = intval($instance['chars']);
    $cat_ids = esc_attr($instance['cat_ids']);
    $disp_views = intval($instance['disp_views']);
?>
    <p>
      <label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('タイトル:', 'xeory_base'); ?> <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>" /></label>
    </p>
    <input type="hidden" name="<?php echo $this->get_field_name('type'); ?>" value="most_viewed">
    <p>
      <label for="<?php echo $this->get_field_id('mode'); ?>"><?php _e('ページビューをカウントするページ:', 'xeory_base'); ?>
        <select name="<?php echo $this->get_field_name('mode'); ?>" id="<?php echo $this->get_field_id('mode'); ?>" class="widefat">
          <option value="both"<?php selected('both', $mode); ?>><?php _e('投稿ページと固定ページ', 'xeory_base'); ?></option>
          <option value="post"<?php selected('post', $mode); ?>><?php _e('投稿ページのみ', 'xeory_base'); ?></option>
          <option value="page"<?php selected('page', $mode); ?>><?php _e('固定ページのみ', 'xeory_base'); ?></option>
        </select>
      </label>
    </p>
    <p>
      <label for="<?php echo $this->get_field_id('limit'); ?>"><?php _e('表示件数:', 'xeory_base'); ?> <input class="widefat" id="<?php echo $this->get_field_id('limit'); ?>" name="<?php echo $this->get_field_name('limit'); ?>" type="text" value="<?php echo $limit; ?>" /></label>
    </p>
    <p>
      <label for="<?php echo $this->get_field_id('chars'); ?>"><?php _e('タイトルの最大文字数:', 'xeory_base'); ?> <input class="widefat" id="<?php echo $this->get_field_id('chars'); ?>" name="<?php echo $this->get_field_name('chars'); ?>" type="text" value="<?php echo $chars; ?>" /></label><br />
      <small><?php _e('<strong>0</strong> to disable.', 'xeory_base'); ?></small>
    </p>
    <p>
      <label for="<?php echo $this->get_field_id('cat_ids'); ?>"><?php _e('表示したいカテゴリーID:', 'xeory_base'); ?> <span style="color: red;">*</span> <input class="widefat" id="<?php echo $this->get_field_id('cat_ids'); ?>" name="<?php echo $this->get_field_name('cat_ids'); ?>" type="text" value="<?php echo $cat_ids; ?>" /></label><br />
      <small><?php _e('複数ある場合はカンマで区切って入力', 'xeory_base'); ?></small>
    </p>
    <p>
    <label for="<?php echo $this->get_field_id('disp_views');?>"><input type="checkbox" name="<?php echo $this->get_field_name('disp_views');?>" value="1" <?php checked($disp_views, "1");?>>ページビュー数を表示する</label><br />
    <small></small>
    </p>

    <input type="hidden" id="<?php echo $this->get_field_id('submit'); ?>" name="<?php echo $this->get_field_name('submit'); ?>" value="1" />
<?php
  }
}


/* Function: Init WP-PostViews Widget
* ---------------------------------------- */
add_action( 'widgets_init', 'bzb_widget_views_init' );
function bzb_widget_views_init() {
  register_widget( 'WP_Widget_PostViews_bzb' );
}




// function testmsg($type=0) {
//     if ( $type == 1 ) {
//         $msg = 'テーマ切替直後のロードです。';
//     } else {
//         $msg = 'テーマへ切替後2回目以降のロードです。';
//     }
//     return '<div id="testmsg" class="error"><p>' . $msg . '</p></div>' . "\n";
// }

/* add comment..
* ---------------------------------------- */
add_action('load-themes.php', 'bzb_pre_views_activation');
function bzb_pre_views_activation() {
    if ( false === get_option('theme_activated') ) {
        //add_action('admin_notices', create_function(null, 'views_activation();'));
        $option_name = 'views_options';
        $option = array(
            'count'                   => 1
          , 'exclude_bots'            => 0
          , 'display_home'            => 0
          , 'display_single'          => 0
          , 'display_page'            => 0
          , 'display_archive'         => 0
          , 'display_search'          => 0
          , 'display_other'           => 0
          , 'use_ajax'                => 1
          , 'template'                => __('%VIEW_COUNT% views', 'xeory_base')
          , 'most_viewed_template'    => '<li><a href="%POST_URL%"  title="%POST_TITLE%">%POST_TITLE%</a><span> %VIEW_COUNT% '.__('PV', 'xeory_base').'</span></li>'
        );

        if ( is_multisite() && $network_wide ){
          $ms_sites = get_sites();

          if( 0 < sizeof( $ms_sites ) ){
            foreach ( $ms_sites as $ms_site ){
              switch_to_blog( $ms_site->blog_id );
              add_option( $option_name, $option );
            }
          }
          restore_current_blog();
        }else{
          add_option( $option_name, $option );
        }
        add_option('theme_activated', true);
    } else {
        //add_action('admin_notices', create_function(null, 'echo testmsg(0);'));
        add_action('switch_theme', function(){'delete_option("theme_activated")';});
    }
}


?>