"use client"

import Editor from "@monaco-editor/react"

type Props = {
  code: string
  language: string
  onChange: (value:string) => void
}

export default function CodeBlock({code,language,onChange}:Props){

  return(

    <Editor
      height="250px"
      defaultLanguage={language}
      value={code}
      theme="vs-dark"
      onChange={(value)=>onChange(value || "")}
      options={{
        minimap:{enabled:false},
        fontSize:14
      }}
    />

  )

}