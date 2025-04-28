import { useEffect } from "react";

export default function App() {
  const textToCopy = `from flask import Flask, jsonify
import redis

app = Flask(__name__)

try:
    redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)
    redis_client.ping()
except redis.exceptions.ConnectionError:
    redis_client = None
    print("Warning: Redis server not available. Caching will be disabled.")

def get_blog_post_from_db(post_id):
    return {"post_id": post_id, "title": f"Post {post_id}", "content": "Sample blog content."}

@app.route('/post/<post_id>')
def get_post(post_id):
    if redis_client:
        cached_post = redis_client.get(post_id)
        if cached_post:
            return jsonify({"source": "cache", "data": cached_post})

    post = get_blog_post_from_db(post_id)

    if redis_client:
        redis_client.setex(post_id, 10, str(post))
    
    return jsonify({"source": "database", "data": post})

@app.route('/clear-cache/<post_id>')
def clear_cache(post_id):
    if redis_client:
        redis_client.delete(post_id)
        return {"message": f"Cache for post {post_id} cleared."}
    else:
        return {"message": "Redis not connected. Nothing to clear."}

if __name__ == '__main__':
    app.run(debug=True)

`;

  useEffect(() => {
    async function copyText() {
      try {
        await navigator.clipboard.writeText(textToCopy);
        console.log("Text copied to clipboard successfully.");
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    }
    copyText();
  }, []);

  return (
    <div style={{ backgroundColor: "black", height: "100vh", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <h1>Content Copied!</h1>
    </div>
  );
}
