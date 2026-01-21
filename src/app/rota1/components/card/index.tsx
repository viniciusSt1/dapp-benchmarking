import React from 'react'
import Subtitle from './subtitle'

export default function card () {
    return (
        <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Card Title</h2>
            <Subtitle />
            <p className="text-gray-600">This is a simple card component.</p>
        </div>
    )
}