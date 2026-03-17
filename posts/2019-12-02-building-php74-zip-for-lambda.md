---
title: "AWS Lambda 用php7.4.zipをつくる"
date: 2019-12-02 09:01:12
---

PHP7.4がリリースされましたね。

そうなったら、当然AWS Lambdaで使いたいじゃないですか（短絡的思考

早速、やってみました。

クラメソさんの以下の記事が参考になりました。

[https://dev.classmethod.jp/cloud/aws/create-lambda-custom-runtime-php72/](https://dev.classmethod.jp/cloud/aws/create-lambda-custom-runtime-php72/)

7.3 のPHPイメージを作成する環境は、以下にあります。

[https://github.com/stackery/php-lambda-layer](https://github.com/stackery/php-lambda-layer)

まずは、cloneします。

$ git clone https://github.com/stackery/php-lambda-layer.git

残念ながら 2019/12/2時点ではPHP7.4には対応していませんが、一部有用ですので活用していきます。

Makefileを見ますと、どんな感じでイメージを作成しているかが分かります。

php73.zip:
docker run --rm -e http_proxy=${http_proxy} -v $(ROOT_DIR):/opt/layer lambci/lambda:build-provided /opt/layer/build-php-remi.sh 3

当方の環境がWindowsであるのと、プロキシとかは不要であることから、直接Dockerコマンドをたたくことにします。

\> docker.exe --rm -v C:\\\\path\\\\to\\\\php-lambda-layer:/opt/layer lambci/lambda:build-provided /opt/layer/build-php-remi.sh 4

。。。失敗しました。

> cp: cannot stat ‘/usr/lib64/libonig.so.5’: No such file or directory

[鬼車がPHP本体にバンドルされなくなったアレ](https://qiita.com/rana_kualu/items/50f9f5735321fe995ff5#%E9%AC%BC%E8%BB%8A)ですね。

build-php-remi.sh を修正します。

yum install -y httpd
yum install -y postgresql-devel
yum install -y libargon2-devel
\# 以下を追加
yum install -y oniguruma5

先ほどのdockerコマンドをやり直します。今度は成功しました。
php74.zip が作成されています。

これをどうごにょごにょするのかは、調べ途中。。。
