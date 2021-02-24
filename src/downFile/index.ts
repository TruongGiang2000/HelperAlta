import RNFetchBlob from 'rn-fetch-blob';
const {fs} = RNFetchBlob;
export const pathLocal = fs?.dirs?.DocumentDir
  ? fs?.dirs?.DocumentDir + '/medias/'
  : undefined;
export const downloadFile = (
  path: string,
  name: string,
  success?: (path: string) => void,
  failed?: (er: any) => void,
) => {
  RNFetchBlob.config({
    // response data will be saved to this path if it has access right.
    path: pathLocal && pathLocal + name,
  })
    .fetch('GET', path, {
      //some headers ..
    })
    .then((res) => success && success(res.path()))
    .catch((er) => failed && failed(er));
};
