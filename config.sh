#!/usr/bin/env bash

script_directory="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

jmeterBinary="/mnt/Data/opt/apache-jmeter-2.7/bin/jmeter"

subscriber_outfile_name="/tmp/test_subscriber.jmx"
publisher_outfile_name="/tmp/test_publisher.jmx"

jndi_location="${script_directory}/defaultjndi.properties"
