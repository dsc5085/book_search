FROM python:3.6

# Install Cron
RUN apt-get update && apt-get -y install cron

# Create directory
ADD . /dir
WORKDIR /dir
RUN chmod 0644 /dir

# Run cron
ADD crontab /etc/cron.d/bookscraper-cron
RUN chmod 0644 /etc/cron.d/bookscraper-cron
RUN crontab /etc/cron.d/bookscraper-cron

# Run the command on container startup
CMD cron && touch /var/log/cron.log && tail -f /var/log/cron.log