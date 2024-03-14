FROM php:7.4-apache
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf