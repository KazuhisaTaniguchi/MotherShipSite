<?php

// テーマサポート機能の追加
function xeory_base_setup() {
    // タイトルタグの自動生成をサポート
    add_theme_support( 'title-tag' );
    
    // その他のテーマサポート機能
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'automatic-feed-links' );
    add_theme_support( 'html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script'
    ) );
}
add_action( 'after_setup_theme', 'xeory_base_setup' );

// ファンクション
if (is_admin()) {
    require_once('lib/admin/init.php');
    require_once('lib/admin/manual.php');
    require_once('lib/functions/category-custom-fields.php');
    require_once('lib/functions/custom-fields.php');
}
require_once('lib/functions/asset.php');
require_once('lib/functions/head.php');
require_once('lib/functions/custom-header.php');
require_once('lib/functions/custom-post.php');
require_once('lib/functions/bzb-functions.php');
require_once('lib/functions/setting.php');
require_once('lib/functions/widget.php');
//require_once('lib/functions/lang.php');
require_once('lib/functions/postviews.php');
require_once('lib/functions/json-ld.php');
require_once('lib/functions/social_btn.php');
require_once('lib/functions/show_avatar.php');
require_once('lib/functions/shortcode.php');
require_once('lib/functions/rss.php');

add_action('wp', 'load_preview_specific_file');

//previewのみでの読み込み
function load_preview_specific_file() {
    if (is_preview()) {
        require_once('lib/admin/preview.php');
    }
}
