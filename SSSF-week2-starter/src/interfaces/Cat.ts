// TODO: cat interface

import {Point} from 'geojson';

interface Cat {
  _id: string;
  cat_name: string;
  weight: number;
  filename: string;
  birthdate: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  owner: {
    _id: string;
    user_name: string;
    email: string;
  };
}
interface CatOutput {
  _id: string;
  cat_name: string;
  weight: number;
  filename: string;
  birthdate: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  owner: {
    _id: string;
    user_name: string;
    email: string;
  };
}

export {Cat, CatOutput};
