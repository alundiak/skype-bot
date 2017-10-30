# Become root first !
# http://qugstart.com/blog/linux/quickest-way-to-create-a-self-signed-ssl-certificate-in-ubuntu/
# mkdir ssl_self_signed 
cd ssl_self_signed
openssl genrsa -des3 -out server.key 1024
openssl rsa -in server.key -out server.key.insecure
mv server.key server.key.secure && mv server.key.insecure server.key
openssl req -new -key server.key -out server.csr
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt


#
# Variant 2 
# http://www.i-visionblog.com/2014/10/create-https-tls-ssl-application-with-express-nodejs-in-localhost-openssl.html
#
mkdir var2 && cd var2
openssl genrsa 1024 > ./key.pem
openssl req -new -key ./key.pem -out csr.pem
openssl x509 -req -days 365 -in key.pem -signkey ./file.pem -out ./ssl.crt
#
# 37634:error:0906D06C:PEM routines:PEM_read_bio:no start line:
# /BuildRoot/Library/Caches/com.apple.xbs/Sources/OpenSSL098/OpenSSL098-64.50.6/src/crypto/pem/pem_lib.c:648:Expecting: CERTIFICATE REQUEST
#
# cd ../

#
# Variant 3 - looks like the easiest
# Download from http://www.selfsignedcertificate.com/ or generate manually
mkdir var3 & cd var3
openssl genrsa -out localhost.key 2048
openssl req -new -x509 -key localhost.key -out localhost.cert -days 3650 -subj /CN=localhost
# cd ../
  