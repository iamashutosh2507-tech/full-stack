import Link from 'next/link'

export default function About() {
  return (
    <main>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>About</h1>
        <p>This project is built with the Next.js App Router.</p>
        <p style={{ marginTop: '1rem' }}>
          <Link href="/">Home</Link>
        </p>
      </header>
    </main>
  )
}
