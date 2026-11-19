<?php get_header(); ?>

<div id="content">

<?php do_action( 'xeory_prepend_content' ); ?>

<div class="wrap">

  <?php do_action( 'xeory_prepend_wrap' ); ?>

    <?php bzb_breadcrumb(); ?>

  <div id="main" <?php bzb_layout_main(); ?> role="main">

  <?php do_action( 'xeory_prepend_main' ); ?>

    <div class="main-inner">

    <?php do_action( 'xeory_prepend_main-inner' ); ?>

    <?php
      if ( have_posts() ) :

        while ( have_posts() ) : the_post();

        ?>

    <?php 
    global $post;
    $cf = get_post_meta($post->ID);
    ?>
    <article id="post-<?php the_id(); ?>" <?php post_class(); ?>>

      <header class="post-header">
        <ul class="post-meta list-inline">
        <?php 
          $post_date_option = get_option('post_date');
          $published_date = get_the_time('Y.m.d');
          $published_datetime = get_the_time('c');
          $modified_date = get_the_modified_date('Y.m.d');
          $modified_datetime = get_the_modified_time('c');

          if( $published_date == $modified_date ) {
              echo '<li class="date published"><time datetime="' . esc_attr( $published_datetime ) . '">' . esc_html( $published_date ) . '</time></li>';
          } else {
              if( $post_date_option == 'option01' ) { 
                  echo '<li class="date published"><time datetime="' . esc_attr( $published_datetime ) . '">' . esc_html( $published_date ) . '</time></li>';
              } elseif( $post_date_option == 'option02' ) { 
                  echo '<li class="date modified"><time datetime="' . esc_attr( $modified_datetime ) . '">' . esc_html( $modified_date ) . '</time></li>';
              } else { 
                  echo '<li class="date published"><time datetime="' . esc_attr( $published_datetime ) . '">' . esc_html( $published_date ) . '</time></li>';
                  echo '<li class="date modified"><time datetime="' . esc_attr( $modified_datetime ) . '">' . esc_html( $modified_date ) . '</time></li>';
              }
          }
        ?>
        </ul>
        <h1 class="post-title"><?php the_title(); ?></h1>
        <div class="post-header-meta">
          <?php bzb_social_buttons();?>
        </div>
      </header>

      <section class="post-content">

      <?php if( get_the_post_thumbnail() ) :
          
          $thumbnail_size = get_option('thumbnail_size');
          if ( $thumbnail_size == 'default' || $thumbnail_size == '' ) {
          ?>
        <div class="post-thumbnail default">
          <?php echo get_the_post_thumbnail(); ?>
        </div>
        <?php } else { ?>
          <div class="post-thumbnail large">
          <?php the_post_thumbnail('full'); ?>
          </div>
        <?php } ?>
        <?php endif; ?>
        <?php
          the_content();

          $args = array(
           'before' => '<div class="pagination">',
           'after' => '</div>',
           'link_before' => '<span>',
           'link_after' => '</span>'
          );

          wp_link_pages($args);
        ?>

      </section>

      <footer class="post-footer">

      <?php bzb_social_buttons();?>

        <ul class="post-footer-list">
          <li class="cat"><i class="fa fa-folder"></i> <?php the_category(', ');?></li>
          <?php
          $posttags = get_the_tags();
          if($posttags){ ?>
          <li class="tag"><i class="fa fa-tag"></i> <?php the_tags('');?></li>
          <?php } ?>
        </ul>
      </footer>

      <aside>
        <?php echo bzb_get_cta($post->ID); ?>


        <?php if( is_active_sidebar('under_post_area') ): ?>
          <div class="under-post-widget">
            <?php dynamic_sidebar('under_post_area'); ?>
          </div>
        <?php endif; ?>

        <h2 class="post-share-title">SNSでもご購読できます。</h2>
        <?php
          $twitter_from_db = "https://x.com/" . esc_html(get_option('twitter_id'));
          $feedly_url = urlencode(get_bloginfo('rss2_url'));
        ?>

          <ul class="post-sns">
            <li class="post-sns-twitter">
             
              <a href="<?php echo $twitter_from_db;?>" taget="_blank">
                <svg width="20" height="21" viewBox="0 0 1200 1227" fill="none" xmlns="https://www.w3.org/2000/svg">
                  <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="#757575"/>
                </svg>
                <span>X</span>でフォローする
              </a>
            </li>
            <li class="post-sns-feedly">
              <a href="https://feedly.com/i/subscription/feed/<?php echo $feedly_url;?>" target="_blank">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.353 20c-.647 0-1.2-.23-1.661-.69A2.27 2.27 0 0 1 0 17.646c0-.648.23-1.201.692-1.661a2.28 2.28 0 0 1 1.66-.692 2.26 2.26 0 0 1 1.663.692c.463.463.693 1.016.69 1.661a2.295 2.295 0 0 1-.69 1.662A2.235 2.235 0 0 1 2.353 20zm14.118 0c0-2.294-.432-4.436-1.294-6.426a16.716 16.716 0 0 0-3.53-5.221 16.674 16.674 0 0 0-5.22-3.53C4.437 3.963 2.295 3.53 0 3.53V0c2.784 0 5.382.52 7.794 1.559a20.2 20.2 0 0 1 10.647 10.647C19.481 14.618 20 17.216 20 20h-3.53zm-7.06 0c0-1.314-.244-2.535-.735-3.662a9.576 9.576 0 0 0-2.029-2.985 9.622 9.622 0 0 0-2.985-2.03c-1.127-.49-2.347-.736-3.662-.735v-3.53c1.804 0 3.485.34 5.045 1.016a13.147 13.147 0 0 1 4.102 2.779 13.162 13.162 0 0 1 2.78 4.103c.678 1.56 1.016 3.242 1.014 5.044h-3.53z" fill="#757575"/>
              </svg>
              <span>Feedly</span>でフォローする</a></li>
          </ul>
      </aside>

      <?php bzb_show_avatar();?>

    <?php comments_template( '', true ); ?>

    </article>


    <?php

        endwhile;

      else :
    ?>

    <p>投稿が見つかりません。</p>

    <?php
      endif;
    ?>

    <?php do_action( 'xeory_append_main-inner' ); ?>

    </div><!-- /main-inner -->

    <?php do_action( 'xeory_append_main' ); ?>

  </div><!-- /main -->

<?php get_sidebar(); ?>

    <?php do_action( 'xeory_append_wrap' ); ?>

</div><!-- /wrap -->

<?php do_action( 'xeory_append_content' ); ?>

</div><!-- /content -->

<?php //記事ページのみに構造化データを出力
if ( is_single()): ?>
  <?php
    //サムネイルを取得
    $thumbnail_id = get_post_thumbnail_id($post);
    $imageobject = wp_get_attachment_image_src( $thumbnail_id, 'full' );
    if( !$imageobject ){
      $imageobject = array();
      $imageobject[0] = get_template_directory_uri() .'/lib/images/noimage.jpg';
    }
    $logo_image = get_option('logo_image');
    if( !$logo_image ){
      $logo_image = get_template_directory_uri() .'/lib/images/masman.png';
    }
  ?>
<?php endif; ?>


<?php get_footer(); ?>


