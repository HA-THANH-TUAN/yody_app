import { Button, Form, FormInstance } from 'antd';
import { useEffect, useRef, useState } from 'react';

interface SubmitButtonProps {
  form: FormInstance;
  children: string;
}
const SubmitButton: React.FC<SubmitButtonProps> = ({ form, children }) => {
  const [submittable, setSubmittable] = useState<boolean>(false);
  const values = Form.useWatch([], form);
  const idTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    clearTimeout(idTimer.current);
    idTimer.current = setTimeout(() => {
      form
        .validateFields({ validateOnly: true })
        .then(() => setSubmittable(true))
        .catch(() => setSubmittable(false));
    }, 100);
  }, [form, values]);
  const handleSubmitForm = () => {
    form.submit();
  };
  return (
    <Button type='primary' onClick={handleSubmitForm} disabled={!submittable}>
      {children}
    </Button>
  );
};

export default SubmitButton;
