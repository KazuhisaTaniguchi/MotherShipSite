<?php
/**
 * お問い合わせ（Contact Form 7）の添付ファイルを、中身でも確かめる。
 *
 * Contact Form 7 の [file] は、拡張子（filetypes:jpg|jpeg|png|pdf）と大きさ（limit:5mb）だけを見る。
 * ここでは、ファイルの中身の種類（MIME）が JPEG・PNG・PDF のどれかで、拡張子と合っているかを確かめる。
 * 合わないときは、その項目をエラーにする（フォームは送られず、メールも届かない）。
 *
 * 対象：名前が your-file- で始まる [file] の項目（your-file-1〜3）。
 * サイト側（frontend/src/components/ContactForm.tsx）でも同じことを確かめているが、API に直接送られたときのために、ここでも確かめる。
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const MOTHERSHIP_ATTACH_TYPES = array(
	'jpg'  => 'image/jpeg',
	'jpeg' => 'image/jpeg',
	'png'  => 'image/png',
	'pdf'  => 'application/pdf',
);

/**
 * @param WPCF7_Validation $result
 * @param WPCF7_FormTag    $tag
 * @param array            $args Contact Form 7 5.4 以降は uploaded_files（項目ごとの、一時保存したファイルのパス）が入る
 * @return WPCF7_Validation
 */
function mothership_cf7_check_attachment( $result, $tag, $args = array() ) {
	if ( 0 !== strpos( (string) $tag->name, 'your-file-' ) ) {
		return $result;
	}

	$types = MOTHERSHIP_ATTACH_TYPES;
	$paths = array();
	$names = array();
	if ( ! empty( $args['uploaded_files'] ) ) {
		$paths = (array) $args['uploaded_files'];
	} elseif ( ! empty( $_FILES[ $tag->name ]['tmp_name'] ) ) { // 古い Contact Form 7 のとき
		$paths = (array) $_FILES[ $tag->name ]['tmp_name'];
		$names = (array) $_FILES[ $tag->name ]['name'];
	}

	foreach ( array_values( $paths ) as $i => $path ) {
		if ( ! is_string( $path ) || '' === $path || ! is_readable( $path ) ) {
			continue;
		}
		$name = isset( $names[ $i ] ) ? $names[ $i ] : $path;
		$ext  = strtolower( pathinfo( $name, PATHINFO_EXTENSION ) );
		$mime = '';
		if ( function_exists( 'finfo_open' ) ) { // 使えないサーバーでは $mime が空になり、エラーにする（安全側）
			$finfo = finfo_open( FILEINFO_MIME_TYPE );
			$mime  = (string) finfo_file( $finfo, $path );
			finfo_close( $finfo );
		}
		$ok = isset( $types[ $ext ] ) && $types[ $ext ] === $mime;
		if ( ! $ok ) {
			$result->invalidate( $tag, 'JPEG・PNG・PDF のファイルだけ添付できます。ファイルの中身と種類が合っていません。' );
			break;
		}
	}

	return $result;
}

// Contact Form 7 自身の確認（拡張子・大きさ）のあとに動かす
add_filter( 'wpcf7_validate_file', 'mothership_cf7_check_attachment', 20, 3 );
add_filter( 'wpcf7_validate_file*', 'mothership_cf7_check_attachment', 20, 3 );
