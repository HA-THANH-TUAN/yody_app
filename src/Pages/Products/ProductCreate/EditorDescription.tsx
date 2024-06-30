// EditorDescription
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import { Alignment } from '@ckeditor/ckeditor5-alignment';
import React, { FC, SetStateAction } from 'react';
// interface IEditorDescription {
//   setDataDesciption: React.Dispatch<React.SetStateAction<string>>;
// }
interface IEditorDescription {
  // onChange: () => void;
  dataDescription: string;
  setDataDesciption: (vl: string) => void;
}
const EditorDescription: FC<IEditorDescription> = ({ setDataDesciption, dataDescription }) => {
  return (
    <div className='mb-0 rounded-md'>
      <CKEditor
        editor={ClassicEditor}
        data={dataDescription}
        config={{
          // plugins: [Alignment],
          // extraPlugins: [Alignment],
          toolbar: {
            items: [
              'alignment',
              'heading',
              '|',
              'bold',
              'italic',
              'link',
              'bulletedList',
              'numberedList',
              '|',
              'outdent',
              'indent',
              'table',
              '|',
              'imageUpload',
              'image',
              'insertTable',
              'blockQuote',
              'mediaEmbed',
              'undo',
              'redo'
            ]
          },
          language: 'vn',
          image: {
            toolbar: [
              'toggleImageCaption',
              'imageTextAlternative',
              'ckboxImageEdit',
              'imageTextAlternative',
              'toggleImageCaption',
              'imageStyle:inline',
              'imageStyle:block',
              'imageStyle:side'
            ]
          },
          table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
          }
          // alignment: {
          //   options: ['left', 'right']
          // }
        }}
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          setDataDesciption(data);
        }}
        onBlur={(event, editor) => {}}
        onFocus={(event, editor) => {}}
      />
    </div>
  );
};

export default EditorDescription;
