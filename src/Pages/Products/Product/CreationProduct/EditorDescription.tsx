import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Form } from 'antd';
import {
  ClassicEditor,
  Bold,
  Essentials,
  Heading,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  Table,
  Undo,
  ImageInsert,
  Image,
  Alignment,
  Font,
  ImageResize,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  LinkImage,
  ImageResizeEditing,
  ImageResizeButtons
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import { FC, useRef } from 'react';
import { IBaseProductCreationForm } from './ProductCreation';

interface IEditorDescription {
  initial: string | null;
}
const EditorDescription: FC<IEditorDescription> = ({ initial }) => {
  const form = Form.useFormInstance<IBaseProductCreationForm>();
  const idTimer = useRef<NodeJS.Timeout>();
  const handleOnChange = (value: ClassicEditor) => {
    const data = value.getData();
    form.setFieldValue('description', data);
  };
  return (
    <CKEditor
      onChange={(_, editor) => {
        clearInterval(idTimer.current);
        idTimer.current = setTimeout(() => {
          handleOnChange(editor);
        }, 150);
      }}
      data={form.getFieldValue('description')}
      editor={ClassicEditor}
      config={{
        toolbar: [
          'undo',
          'redo',
          '|',
          'heading',
          '|',
          'fontFamily',
          'fontSize',
          'fontColor',
          'fontBackgroundColor',
          '|',
          'bold',
          'italic',
          '|',
          'alignment:left',
          'alignment:right',
          'alignment:center',
          'alignment:justify',
          '|',
          'bulletedList',
          'numberedList',
          'todoList',
          'indentBlock',
          '|',
          'insertImage',
          'insertImageViaUrl',
          'link',
          '|',
          'toggleImageCaption',
          'imageTextAlternative',
          'ckboxImageEdit',
          'imageToolbar',
          'imageResizeEditing',
          'resizeImage'
        ],
        plugins: [
          Paragraph,
          Font,
          Bold,
          Essentials,
          Heading,
          Indent,
          IndentBlock,
          Italic,
          Alignment,
          Link,
          List,
          MediaEmbed,
          Table,
          Undo,
          Image,
          ImageInsert,
          ImageResize,
          ImageResizeEditing,
          ImageResizeButtons,
          ImageCaption,
          ImageStyle,
          ImageToolbar,
          LinkImage
        ],
        initialData: initial ?? ''
        // initialData:
        // '<img src="https://th.bing.com/th?id=ORMS.04f73b286a4bdc82a55c196f0ae824b1&pid=Wdp&w=612&h=328&qlt=90&c=1&rs=1&dpr=1&p=0" alt="" srcset="" />'
      }}
    />
  );
};

export default EditorDescription;
