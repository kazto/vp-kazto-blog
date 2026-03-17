---
title: "AWS IAMこねくりまわし"
date: 2019-11-24 09:01:11
---

[昨日の投稿](https://www.kazto.net/diary/069)のつづき。

やっぱりAWSを触るからには、AWS CLIですべてを操作したいじゃないですか。

昨日の段階ではルートアカウントで操作したったらええやん思ってましたが、AWSに「ルートアカウントのアクセスキーを消せ！」と怒られたので、ひとまずIAMだけこねくりまわせるだけのグループ・ユーザを作成します。

##### [グループ、ユーザの作成](/diary/071#%e3%82%b0%e3%83%ab%e3%83%bc%e3%83%97%e3%80%81%e3%83%a6%e3%83%bc%e3%82%b6%e3%81%ae%e4%bd%9c%e6%88%90)

新規グループを作成します。

[![01_create-group.png](https://assets.blog.kazto.dev/images/2019/1124/01_create-group.png)](https://assets.blog.kazto.dev/images/2019/1124/01_create-group.png "01_create-group.png")

グループ名を入力します。

[![02_create-group-name.png](https://assets.blog.kazto.dev/images/2019/1124/02_create-group-name.png)](https://assets.blog.kazto.dev/images/2019/1124/02_create-group-name.png "02_create-group-name.png")

IAMFullAccessポリシーを割り当てます。

[![03_create-group-attach-policy.png](https://assets.blog.kazto.dev/images/2019/1124/03_create-group-attach-policy.png)](https://assets.blog.kazto.dev/images/2019/1124/03_create-group-attach-policy.png "03_create-group-attach-policy.png")

確認して、グループ作成します。

[![04_create-group-velify.png](https://assets.blog.kazto.dev/images/2019/1124/04_create-group-velify.png)](https://assets.blog.kazto.dev/images/2019/1124/04_create-group-velify.png "04_create-group-velify.png")

新規ユーザを作成します。

[![05_create-user.png](https://assets.blog.kazto.dev/images/2019/1124/05_create-user.png)](https://assets.blog.kazto.dev/images/2019/1124/05_create-user.png "05_create-user.png")

ユーザ名を入力します。

[![06_create-user-name.png](https://assets.blog.kazto.dev/images/2019/1124/06_create-user-name.png)](https://assets.blog.kazto.dev/images/2019/1124/06_create-user-name.png "06_create-user-name.png")

ユーザにグループを割り当てます。

[![07_create-user-add-group.png](https://assets.blog.kazto.dev/images/2019/1124/07_create-user-add-group.png)](https://assets.blog.kazto.dev/images/2019/1124/07_create-user-add-group.png "07_create-user-add-group.png")

確認して、ユーザを作成します。

[![08_create-user-verify.png](https://assets.blog.kazto.dev/images/2019/1124/08_create-user-verify.png)](https://assets.blog.kazto.dev/images/2019/1124/08_create-user-verify.png "08_create-user-verify.png")

アクセスキーを取得します。

[![09_create-user-get-key.png](https://assets.blog.kazto.dev/images/2019/1124/09_create-user-get-key.png)](https://assets.blog.kazto.dev/images/2019/1124/09_create-user-get-key.png "09_create-user-get-key.png")

これで、AWS CLIからIAMを更新する準備が整いました。

で、今日は時間切れ。
