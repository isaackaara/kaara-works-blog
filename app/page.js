import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

export default function BlogHome() {
  const postsDirectory = path.join(process.cwd(), 'app/blog/posts');
  
  let posts = [];
  
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    
    posts = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        
        // Get excerpt (first 200 chars of content)
        const excerpt = content.replace(/^#.*\n/, '').substring(0, 200) + '...';
        
        return {
          slug,
          title: data.title,
          date: data.date,
          description: data.description || excerpt,
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error reading posts:', error);
  }

  return (
    <main>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Kaara Works Blog</h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>AI transformation in East Africa</p>
      </div>

      {posts.length === 0 ? (
        <p>No posts yet. Check back soon!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {posts.map(post => (
            <article key={post.slug} style={{ 
              borderBottom: '1px solid #eee', 
              paddingBottom: '2rem' 
            }}>
              <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h2 style={{ 
                  fontSize: '1.8rem', 
                  marginBottom: '0.5rem',
                  color: '#111',
                  cursor: 'pointer'
                }}>
                  {post.title}
                </h2>
              </Link>
              <time style={{ color: '#666', fontSize: '0.9rem' }}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <p style={{ marginTop: '1rem', color: '#444', lineHeight: '1.6' }}>
                {post.description}
              </p>
              <Link href={`/blog/${post.slug}`} style={{ 
                color: '#0066cc', 
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Read more →
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
