FROM php:8.3-apache

RUN docker-php-ext-install pdo_mysql \
    && a2enmod rewrite

COPY parkeate-api.conf /etc/apache2/conf-enabled/parkeate-api.conf

WORKDIR /var/www/html
