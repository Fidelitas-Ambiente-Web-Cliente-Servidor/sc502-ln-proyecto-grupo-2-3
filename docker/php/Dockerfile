FROM php:8.3-apache

RUN docker-php-ext-install pdo_mysql mysqli \
    && a2enmod rewrite \
    && mkdir -p /var/www/html/uploads \
    && chown -R www-data:www-data /var/www/html/uploads

COPY parkeate.conf /etc/apache2/sites-available/000-default.conf
COPY php.ini /usr/local/etc/php/conf.d/parkeate.ini

RUN apache2ctl configtest

WORKDIR /var/www/html
