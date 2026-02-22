import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'app/blog/posts');
  
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => ({
        slug: fileName.replace(/\.md$/, ''),
      }));
  } catch (error) {
    return [];
  }
}

export default function BlogPost({ params }) {
  const { slug } = params;
  const postsDirectory = path.join(process.cwd(), 'app/blog/posts');
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  
  let post = null;
  
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    post = {
      title: data.title,
      date: data.date,
      author: data.author,
      content,
    };
  } catch (error) {
    return <div>Post not found</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <article>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{post.title}</h1>
        <div style={{ color: '#666', fontSize: '0.95rem' }}>
          <time>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          {post.author && <span> · by {post.author}</span>}
        </div>
      </header>

      <div style={{ 
        fontSize: '1.1rem', 
        lineHeight: '1.8',
        color: '#333'
      }}>
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => <h1 style={{ fontSize: '2rem', marginTop: '2rem', marginBottom: '1rem' }} {...props} />,
            h2: ({ node, ...props }) => <h2 style={{ fontSize: '1.7rem', marginTop: '2rem', marginBottom: '1rem' }} {...props} />,
            h3: ({ node, ...props }) => <h3 style={{ fontSize: '1.4rem', marginTop: '1.5rem', marginBottom: '0.75rem' }} {...props} />,
            p: ({ node, ...props }) => <p style={{ marginBottom: '1.25rem' }} {...props} />,
            ul: ({ node, ...props }) => <ul style={{ marginBottom: '1.25rem', paddingLeft: '2rem' }} {...props} />,
            ol: ({ node, ...props }) => <ol style={{ marginBottom: '1.25rem', paddingLeft: '2rem' }} {...props} />,
            li: ({ node, ...props }) => <li style={{ marginBottom: '0.5rem' }} {...props} />,
            strong: ({ node, ...props }) => <strong style={{ fontWeight: '600', color: '#000' }} {...props} />,
            a: ({ node, ...props }) => <a style={{ color: '#0066cc', textDecoration: 'underline' }} {...props} />,
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      <footer style={{ 
        marginTop: '3rem', 
        paddingTop: '2rem', 
        borderTop: '1px solid #eee',
        textAlign: 'center'
      }}>
        <a href="/" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: '500' }}>
          ← Back to all posts
        </a>
      </footer>
    </article>
  );
}
