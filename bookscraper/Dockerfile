FROM python:3.6

# Install Cron
RUN apt-get update && apt-get -y install cron

# Run requirements
COPY requirements.txt /
RUN pip3 install -r /requirements.txt

# Create directory
ADD . /bookscraper
WORKDIR /bookscraper
RUN chmod 0644 /bookscraper

# Run cron
ADD crontab /etc/cron.d/bookscraper-cron
RUN chmod 0644 /etc/cron.d/bookscraper-cron
RUN crontab /etc/cron.d/bookscraper-cron

# Run the command on container startup
CMD cron && touch /var/log/cron.log && tail -f /var/log/cron.log