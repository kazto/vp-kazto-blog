---
title: "#たまもく 2019/11/23 成果"
date: 2019-11-23 09:01:09
tags: [study-group, aws, php, tech]
---

[たまもく](https://tamamoku.connpass.com/)も少し間をあけましたが、再開してトータル第6回を数えています。

やるからにはちゃんと成果を記録に残さねば、と思いまして、作業記録を残します。

今回は、来月のアドベントカレンダーのネタであるところの、「AWS LambdaでPHPでスクレイピングする環境を整える」件の調査を進めました。

##### [AWS Lambda に Serverless CLI をつかってデプロイする](/diary/069#aws-lambda-%e3%81%ab-serverless-cli-%e3%82%92%e3%81%a4%e3%81%8b%e3%81%a3%e3%81%a6%e3%83%87%e3%83%97%e3%83%ad%e3%82%a4%e3%81%99%e3%82%8b)

インストールとかは、以下の手順。sudoとかは適宜つけてください。

$ pip install awscli aws-sam-cli
$ npm i -g serverless

まずはawsにログインします。アクセスキー、シークレットの入手は次の節でまとめます。

$ aws configure
AWS Access Key ID \[None\]: XXXXXXXXXXXXXXXX
AWS Secret Access Key \[None\]: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Default region name \[None\]: ap-northeast-1
Default output format \[None\]:

テンプレを使ってプロジェクトを作ります。

$ sls create -t aws-provided -p aws-php-selenium-docker

まずは、テンプレそのまんまをデプロイしてみます。

$ sls deploy

権限が足りないエラー発生、権限追加、を何度か繰り返して、ようやくデプロイできました。

呼び出してみます。

$ sls invoke -f hello
{
"body": {
"input": {},
"msg": "Wecome to serverless!"
}
}

JSONが返ってきました。

##### [AWS IAM で適切な権限のユーザをつくる](/diary/069#aws-iam-%e3%81%a7%e9%81%a9%e5%88%87%e3%81%aa%e6%a8%a9%e9%99%90%e3%81%ae%e3%83%a6%e3%83%bc%e3%82%b6%e3%82%92%e3%81%a4%e3%81%8f%e3%82%8b)

これ、だいぶ試行錯誤しました。正解かどうかも若干あやしいところ。ひとまず、やったことを残します。誰かツッコんでください。（切実）

2.  ルートアカウントでログイン

3.  IAM でグループを作成する

4.  IAM でユーザを作成し、グループに割り当てる

5.  アクセスキー、シークレットを取得する

IAMの画面です。

グループを作成します。

[![01_create-group.png](https://assets.blog.kazto.dev/images/2019/1123/01_create-group.png)](https://assets.blog.kazto.dev/images/2019/1123/01_create-group.png "01_create-group.png")

グループに適当に名前をつけます。

[![02_create-group-name.png](https://assets.blog.kazto.dev/images/2019/1123/02_create-group-name.png)](https://assets.blog.kazto.dev/images/2019/1123/02_create-group-name.png "02_create-group-name.png")

適当にポリシーをアタッチします。

[![03_create-group-attach-policy.png](https://assets.blog.kazto.dev/images/2019/1123/03_create-group-attach-policy.png)](https://assets.blog.kazto.dev/images/2019/1123/03_create-group-attach-policy.png "03_create-group-attach-policy.png")

確認画面で、作成ボタンで作成します。

[![04_create-group-verify.png](https://assets.blog.kazto.dev/images/2019/1123/04_create-group-verify.png)](https://assets.blog.kazto.dev/images/2019/1123/04_create-group-verify.png "04_create-group-verify.png")

次に、ユーザを作成します。

[![05_create-user.png](https://assets.blog.kazto.dev/images/2019/1123/05_create-user.png)](https://assets.blog.kazto.dev/images/2019/1123/05_create-user.png "05_create-user.png")

適当にユーザ名を作成します。

[![06_create-user-name.png](https://assets.blog.kazto.dev/images/2019/1123/06_create-user-name.png)](https://assets.blog.kazto.dev/images/2019/1123/06_create-user-name.png "06_create-user-name.png")

ユーザを先ほど作成したグループに加えます。

[![07_create-user-add-group.png](https://assets.blog.kazto.dev/images/2019/1123/07_create-user-add-group.png)](https://assets.blog.kazto.dev/images/2019/1123/07_create-user-add-group.png "07_create-user-add-group.png")

こうしてできたユーザの認証情報から、アクセスキーの生成を行います。

[![08_create-user-get-access-key.png](https://assets.blog.kazto.dev/images/2019/1123/08_create-user-get-access-key.png)](https://assets.blog.kazto.dev/images/2019/1123/08_create-user-get-access-key.png "08_create-user-get-access-key.png")

[![09_create-user-show-access-key.png](https://assets.blog.kazto.dev/images/2019/1123/09_create-user-show-access-key.png)](https://assets.blog.kazto.dev/images/2019/1123/09_create-user-show-access-key.png "09_create-user-show-access-key.png")

##### [あとから思ったんですけど](/diary/069#%e3%81%82%e3%81%a8%e3%81%8b%e3%82%89%e6%80%9d%e3%81%a3%e3%81%9f%e3%82%93%e3%81%a7%e3%81%99%e3%81%91%e3%81%a9)

これ、awscli から全部できるんじゃね？と思って、調べてみたらできるっぽいです。

ルートアカウントのセキュリティ資格情報を開きます。

[![10_root-user-authentication.png](https://assets.blog.kazto.dev/images/2019/1123/10_root-user-authentication.png)](https://assets.blog.kazto.dev/images/2019/1123/10_root-user-authentication.png "10_root-user-authentication.png")

「アクセスキー (アクセスキー ID とシークレットアクセスキー)」から、新しいアクセスキーを作成します。

[![11_root-user-create-key.png](https://assets.blog.kazto.dev/images/2019/1123/11_root-user-create-key.png)](https://assets.blog.kazto.dev/images/2019/1123/11_root-user-create-key.png "11_root-user-create-key.png")

これを、`aws configure` で入力してルートアカウント権限になります。あとは、コマンドをバシバシと打つ。

・・・はずなんですけど、今日は時間切れ。
