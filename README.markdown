# Parse RSS Action Block

## Example Usage

	curl -v -X OPTIONS http://block-parse-rss.herokuapp.com
	
	curl -i -X POST -d '{"inputs":[{"url":"http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml"}]}' -H "Content-Type: application/json" http://block-parse-rss.herokuapp.com

