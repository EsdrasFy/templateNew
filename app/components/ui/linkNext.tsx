"use client"
import Link from 'next/link'
import React from 'react'
interface LinkNextProps{
    href: string
    content: string
    classname: string
}

function LinkNext({href, content, classname}:LinkNextProps) {
  return (
      <Link href={href} className={classname}>{content}</Link>
  )
}

export default LinkNext