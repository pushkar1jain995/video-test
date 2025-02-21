'use client'
import { useState } from 'react'

interface JoinFormProps {
  onJoin: (username: string) => void;
}

const JoinForm = ({ onJoin }: JoinFormProps) => {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    onJoin(name.trim())
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>
      <form onSubmit={handleSubmit} style={{
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        backgroundColor: 'white',
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Join Video Call</h2>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            placeholder="Enter your name"
            style={{
              padding: '0.5rem',
              width: '100%',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
          {error && <p style={{ color: 'red', marginTop: '0.5rem', fontSize: '0.875rem' }}>{error}</p>}
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.5rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Join Call
        </button>
      </form>
    </div>
  )
}

export default JoinForm
