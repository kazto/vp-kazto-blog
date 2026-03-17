---
title: "Googleカレンダーの予定をSlackにリマインドしてみた"
date: 2018-03-20 19:14:58
---

Gooble Apps Scriptが便利そうだなーと思いまして、いろいろ調べていましたところ、
[Googleカレンダーの予定をメールでリマインドする方](http://www.casleyconsulting.co.jp/blog-engineer/googleappsscript/google-apps-script%E3%81%A7%E3%82%AB%E3%83%AC%E3%83%B3%E3%83%80%E3%83%BC%E9%80%A3%E5%8B%95%E3%83%AA%E3%83%9E%E3%82%A4%E3%83%B3%E3%83%89%E3%81%AE%E3%81%99%E3%82%9D%E3%82%81/)と、
[GASを使ってSlackのBotを立てている方](https://tech.camph.net/slack-bot-with-gas/)がいらっしゃいました。

いいとこどりしてみました。

#### [Googleドライブにスクリプトを作成する](/diary/09#k9p0.1)

まずはGoogleドライブにアクセスしまして、「新規」→「その他」→「Gooble Apps Script」を選択します。

[![gas.png](https://assets.blog.kazto.dev/images/2018/gas.png)](https://assets.blog.kazto.dev/images/2018/gas.png "gas.png")

上記のようなテンプレートが現れます。

#### [SlackAppライブラリをインポートする](/diary/09#k9p0.2)

メニューの「リソース」→「ライブラリ...」を選択します。ダイアログの「ライブラリを追加」のボックスに「M3W5Ut3Q39AaIwLquryEPMwV62A3znfOO」を入力、追加ボタンを押します。この辺の詳細は[ご本家の方の記事参照](https://qiita.com/soundTricker/items/43267609a870fc9c7453)。

#### [スクリプトプロパティの登録](/diary/09#k9p0.3)

先に、他人様に見せたくないアクセストークンなどの情報を、スクリプトのプロパティに登録します。（こういうことができるんだ、とビックリ仰天しました！）

メニューの「ファイル」「プロジェクトのプロパティ」「スクリプトのプロパティ」タブを選択します。「行を追加」で、キーと値のペアを追加していきます。

> SLACK_POST_ID => SlackのメンバーID（"@XXXXXXXX" といった形式）
> GCAL_WATCH_ID => リマインドしたいGoogleカレンダーのID（だいたいメールアドレスの形式）
> SLACK_ACCESS_TOKEN => Slackの投稿用アクセストークン（xoxp-XXXXXXXXXXXXXXXXXXXXXXXXXXX...とながーいやつ）

#### [GASを書く](/diary/09#k9p0.4)

さあ、準備はできました。ガッと以下を書き上げます。

function postCalendarNotify() {
var calID = PropertiesService.getScriptProperties().getProperty('GCAL_WATCH_ID');
var cal = CalendarApp.getCalendarById(calID);
var dt = new Date();
dt.setDate(dt.getDate());
var events = cal.getEventsForDay(dt);
var slack = SlackApp.create(PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN'));
var listMsg = \[
"本日の予定",
"----------"
\]
for(var i = 0; i < events.length; i++)
{
var msg = events\[i\].getStartTime() + "～ " + events\[i\].getTitle();
listMsg.push(msg);
}
if(events.length == 0)
{
listMsg.push("ありません");
}
var channelID = PropertiesService.getScriptProperties().getProperty('SLACK_POST_ID');
var text = listMsg.join("\\
");
var option = {as_user: "true"};
slack.postMessage(channelID, text, option);
}

#### [定時実行の設定](/diary/09#k9p0.5)

メニューの「編集」「現在のプロジェクトのトリガー」を選択します。「新しいトリガーを追加」で追加します。一日一回動かしたいので、時間主導型、日タイマー、午前3時～4時、を選択しました。この辺はお好きに設定してください。

#### [あとは待つだけ](/diary/09#k9p0.6)

夜な夜な、当日の予定がSlackに届きます。
