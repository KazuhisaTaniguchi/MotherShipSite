<?php
/**
 * 公開中の投稿・固定ページが変わったら、GitHub Actions で Next.js（mothershipremote.com）をビルドし直す。
 *
 * 使うには wp-config.php に次の定数を書く（トークンは Git・Obsidian に書かない）：
 *   define( 'GITHUB_DISPATCH_TOKEN', 'github_pat_...' );
 *   トークン：Fine-grained、リポジトリ MotherShipSite だけ、権限は Contents: Read and write
 * 定数が無いときは何もしない。
 *
 * 動くとき：公開、公開中の更新、公開 → 下書き・非公開・ゴミ箱、予約投稿の公開
 * 動かないとき：下書きの保存、自動保存、リビジョン
 * 一括編集などで 1 回のリクエスト中に何件変わっても、送るのは最後に 1 回だけ。
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const MOTHERSHIP_BUILD_REPO       = 'KazuhisaTaniguchi/MotherShipSite';
const MOTHERSHIP_BUILD_EVENT      = 'wordpress-updated';
const MOTHERSHIP_BUILD_POST_TYPES = array( 'post', 'page' );

add_action( 'transition_post_status', 'mothership_build_on_transition', 10, 3 );
function mothership_build_on_transition( $new_status, $old_status, $post ) {
	if ( ! in_array( $post->post_type, MOTHERSHIP_BUILD_POST_TYPES, true ) ) {
		return;
	}
	if ( wp_is_post_revision( $post ) || wp_is_post_autosave( $post ) ) {
		return;
	}
	// 公開に関係する変化だけ（公開から、または公開へ）
	if ( 'publish' !== $new_status && 'publish' !== $old_status ) {
		return;
	}
	mothership_build_queue( $post );
}

/** このリクエストの終わりに 1 回だけ送る */
function mothership_build_queue( $post ) {
	global $mothership_build_posts;
	if ( empty( $mothership_build_posts ) ) {
		$mothership_build_posts = array();
		add_action( 'shutdown', 'mothership_build_send' );
	}
	$mothership_build_posts[] = $post->post_type . ':' . $post->ID;
}

function mothership_build_send() {
	global $mothership_build_posts;
	if ( empty( $mothership_build_posts ) || ! defined( 'GITHUB_DISPATCH_TOKEN' ) || '' === GITHUB_DISPATCH_TOKEN ) {
		return;
	}
	$res = wp_remote_post(
		'https://api.github.com/repos/' . MOTHERSHIP_BUILD_REPO . '/dispatches',
		array(
			'timeout' => 8,
			'headers' => array(
				'Authorization'        => 'Bearer ' . GITHUB_DISPATCH_TOKEN,
				'Accept'               => 'application/vnd.github+json',
				'X-GitHub-Api-Version' => '2022-11-28',
				'Content-Type'         => 'application/json',
				'User-Agent'           => 'mothership-wordpress',
			),
			'body'    => wp_json_encode(
				array(
					'event_type'     => MOTHERSHIP_BUILD_EVENT,
					'client_payload' => array( 'changed' => array_values( array_unique( $mothership_build_posts ) ) ),
				)
			),
		)
	);
	// 成功は 204。失敗はサーバーのエラーログに残す（トークンは書かない）
	$code = is_wp_error( $res ) ? $res->get_error_message() : wp_remote_retrieve_response_code( $res );
	if ( 204 !== $code ) {
		error_log( '[mothership] GitHub へのビルド依頼に失敗しました: ' . ( is_string( $code ) ? $code : 'HTTP ' . $code ) );
	}
}
