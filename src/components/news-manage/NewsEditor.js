import React, { useState, useEffect } from 'react'
import { Editor } from 'react-draft-wysiwyg';
import { editorState, convertToRaw, ContentState, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

export default function NewsEditor(props) {
    const [editorState, setEditorState] = useState("")
    // const [content, setcontent] = useState("")


    useEffect(() => {
        const html = props.content;
        if(!html) return;
        // console.log("html",html);
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState);
        }
    }, [props.content])

    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName='toolbarClassName'
                wrapperClassName='wrapperClassName'
                editorClassName="editorClassName"
                // onEditorStateChange={setEditorState}
                onEditorStateChange={(editorState) => setEditorState(editorState)}
                onBlur={() => {
                    // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />
        </div>
    )
}
