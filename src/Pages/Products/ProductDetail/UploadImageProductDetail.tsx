import { Upload } from 'antd';
import React, { FC } from 'react';

interface IUploadImageProductDetail {
  data: any[];
}

const UploadImageProductDetail: FC<IUploadImageProductDetail> = ({ data }) => {
  return (
    <div>
      <Upload />
    </div>
  );
};

export default UploadImageProductDetail;
