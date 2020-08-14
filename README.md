# Syscon



## Deployment
---
Note: For subdomain (backend.syscon.io) create A recrod in r53 for www.backend.syscon.io and a alias of A record for backend.syscon.io

#### Server (Apache 2)
- Install apache2 by running ```sudo apt install apache2```
- Start server by running ```sudo systemctl start apache2```
- Getting LetsEncrypt certificate using certbot ([help](https://certbot.eff.org/))
```
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository universe
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update 

###!--- Stop apache to run the following commands

sudo apt-get install certbot python-certbot-apache
certbot certonly --standalone -d syscon.com -d backend.syscon.com
```
- Create seperate directory for frontend ```mkdir -p /var/www/syscon/public_html```
- Create separate directory for backend directory too, it wont be used however, why? idk just do it ```mkdir -p /var/www/syscon-backend/public_html```
- Set folder permissions ```chmod -R 755 /var/www```
- Copy the default configuration file for each site, this will also ensure that you always have a default copy for future site creation. ```cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/syscon.conf```
- Paste the following code inside the ***syscon.conf*** file. You may have to change according to the needs.
```
<VirtualHost *:80>
	ServerAdmin contact@syscon.io
	DocumentRoot /var/www/syscon/public_html
        ServerName syscon.io
	ServerAlias www.syscon.io

	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined

	<Directory /var/www/syscon/public_html>
		Options Indexes FollowSymLinks MultiViews
		AllowOverride All
		Require all granted
	</Directory>

</VirtualHost>


<VirtualHost *:443>
	SSLEngine On
	SSLCertificateFile /etc/letsencrypt/live/syscon.io/cert.pem
	SSLCertificateKeyFile /etc/letsencrypt/live/syscon.io/privkey.pem

	ServerAdmin admin@syscon.io
	ServerName syscon.io
	ServerAlias www.syscon.io
	DocumentRoot /var/www/syscon/public_html/
	
	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined

	<Directory /var/www/syscon/public_html>
		Options Indexes FollowSymLinks MultiViews
		AllowOverride All
		Require all granted
	</Directory>

</VirtualHost>





<VirtualHost *:80>
 	ServerName backend.syscon.io
	ServerAlias www.backend.syscon.io
 	ServerAdmin contact@backend.syscon.io

 	DocumentRoot /var/www/syscon-backend/public_html/

	<Directory /var/www/syscon-backend/public_html>
		Options Indexes FollowSymLinks MultiViews
		AllowOverride All
		Order allow,deny
		allow from all
	</Directory>

	ErrorLog /var/log/apache2/subdomain.example.com.error.log
	CustomLog /var/log/apache2/subdomain.example.com.access.log combined

	ProxyPreserveHost On
	ProxyRequests Off
	ProxyPass / http://127.0.0.1:8080/
	ProxyPassReverse / http://127.0.0.1:8080/

</VirtualHost>

<VirtualHost *:443>
	SSLEngine On
	SSLCertificateFile /etc/letsencrypt/live/backend.syscon.io/cert.pem
	SSLCertificateKeyFile /etc/letsencrypt/live/backend.syscon.io/privkey.pem

	ServerAdmin admin@backend.syscon.io
	ServerName backend.syscon.io
	ServerAlias www.backend.syscon.io
	DocumentRoot /var/www/syscon-backend/public_html/
	
	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined

	ProxyPreserveHost On
	ProxyRequests Off
	ProxyPass / http://127.0.0.1:8080/ retry=1 acquire=3000 timeout=600 Keepalive=On
	ProxyPassReverse / http://127.0.0.1:8080/ 
</VirtualHost>
```
- Enable apache modules
```
sudo a2enmod ssl
sudo a2ensite syscon.conf
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
```
- Reload apache server by running ```sudo systemctl reload apache2```

#### Frontend
- Place the distribution inside server directory that is being served
- Make sure the connection is established over HTTPS (Apache or Nginx config)
- Before producing any build, make sure the url for backend is updated in services present inside ***src/app/services*** directory

### Backend
- Clone the repo
- Run ```npm install``` to install dependencies
- Use **HTTP** in ```var protocol = 'http';``` inside ***bin/www***
- Make sure **tmux** is installed to keep server alive after closing ssh session to with server. Start tmux by running ```tmux``` or join a session by running ```tmux attach -t <session_id>```
- Use ```npm start ./bin/www``` or ```node start ./bin/www``` to start the server
- To de-attach from tmux, press ***ctrl+b d***


### Useful Links
Following tutorials were used when deploying for the first time
- Multiple virtual host on apache2: https://www.liquidweb.com/kb/configure-apache-virtual-hosts-ubuntu-18-04/
- Getting letsencrypt certificate: https://www.freecodecamp.org/news/going-https-on-amazon-ec2-ubuntu-14-04-with-lets-encrypt-certbot-on-nginx-696770649e76/
- Use proxy for apache: https://stackoverflow.com/questions/34865193/proxypass-apache-https-to-a-node-server
- Enable proxy for apache: https://www.digitalocean.com/community/tutorials/how-to-use-apache-as-a-reverse-proxy-with-mod_proxy-on-ubuntu-16-04
- Node server over https: https://blog.cloudboost.io/setting-up-an-https-sever-with-node-amazon-ec2-nginx-and-lets-encrypt-46f869159469


