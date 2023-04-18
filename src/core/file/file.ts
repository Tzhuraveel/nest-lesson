import { HttpException, HttpStatus } from '@nestjs/common';

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const format = file.originalname.split('.')[1];

  const randomName = new Array(8)
    .fill(0)
    .map(() => Math.round(Math.random() * 10).toString())
    .join('');

  callback(null, `${name}${randomName}.${format}`);
};

export const fileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|svg|png|JPG)$/)) {
    return callback(
      new HttpException('Only image file are allowed', HttpStatus.BAD_REQUEST),
      false,
    );
  }
  callback(null, true);
};
