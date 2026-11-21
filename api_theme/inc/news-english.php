<?php
// お知らせの英語版：1 つの記事の本文に、日本語と英語を書く。
// 区切り（クラス news-en の付いた区切り線）より上が日本語、下が英語。英語のタイトルは、区切りのすぐ下の見出し。
// サイト（Next.js）が、区切りで本文を分けて、日本語のページ（/news/{ID}/）と英語のページ（/en/news/{ID}/）に出す。
// 区切りの無い記事は、日本語だけ（英語のお知らせには出ない）。
// ここでは、エディターで 1 回で入れられるように、ブロックのパターン「ここから英語版」を登録する。
add_action( 'init', function () {
	if ( ! function_exists( 'register_block_pattern' ) ) {
		return;
	}
	register_block_pattern_category( 'mothership', array( 'label' => 'MOTHERSHIP' ) );
	register_block_pattern(
		'mothership/news-english',
		array(
			'title'       => 'ここから英語版（お知らせ）',
			'description' => 'この区切り線より下が、英語のお知らせになります。すぐ下の見出しが、英語のタイトルです。',
			'categories'  => array( 'mothership' ),
			'keywords'    => array( 'english', 'en', '英語' ),
			'content'     => '<!-- wp:separator {"className":"news-en"} -->
<hr class="wp-block-separator has-alpha-channel-opacity news-en"/>
<!-- /wp:separator -->

<!-- wp:heading -->
<h2 class="wp-block-heading">English title here</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Write the English version here.</p>
<!-- /wp:paragraph -->',
		)
	);
} );
