from flask import Flask
import redis
app = Flask(__name__)
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

def get_blog_post_from_db(post_id):
    return {"post_id": post_id, "title": f"Post {post_id}", "content": "Sample blog content."}

@app.route('/post/<post_id>')
def get_post(post_id):
    cached_post = redis_client.get(post_id)
    if cached_post:
        return {"source": "cache", "data": cached_post}

    post = get_blog_post_from_db(post_id)
    redis_client.setex(post_id, 10, str(post))
    return {"source": "database", "data": post}

@app.route('/clear-cache/<post_id>')
def clear_cache(post_id):
    redis_client.delete(post_id)
    return {"message": f"Cache for post {post_id} cleared."}

app.run(debug=True)
