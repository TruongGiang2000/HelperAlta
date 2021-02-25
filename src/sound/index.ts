import {pathLocal, downloadFile} from '../downFile';
import Sound from 'react-native-sound';
import RNFetchBlob from 'rn-fetch-blob';
import BackgroundTimer from 'react-native-background-timer';
import lodash from 'lodash';
import axios from 'axios';
import md5 from 'md5';
const {fs} = RNFetchBlob;
let preVolume: number = -1;
let _stopSoundApi: any;
export const stopSoundApi = () => _stopSoundApi && _stopSoundApi();
let fileArr: any[] = [];
let nameFileArr: any[] = [];
let isDownloaded = true;
const pathUrl = 'https://sanbot.dev-altamedia.com/';
BackgroundTimer.setInterval(() => {
  if (!isDownloaded || lodash.isEmpty(fileArr)) {
    return;
  }
  isDownloaded = false;
  const firstItemFile = fileArr.shift();
  const firstItemName = nameFileArr.shift();
  downloadFile(
    firstItemFile,
    firstItemName,
    (res) => {
      isDownloaded = true;
    },
    (err) => console.log('Download Err', err),
  );
}, 2000);
export const cacheFile = async (file: string, name?: string) => {
  let filePlay: string = file;
  let exist = false;
  try {
    const split = file.split('/');
    const nameFile = split[split.length - 1];
    const nameFileMain = !!name ? name : nameFile;
    const _localPath = pathLocal + nameFileMain;
    exist = await fs.exists(_localPath);
    if (exist) {
      filePlay = _localPath;
    } else {
      if (!!file) {
        fileArr.push(file);
        nameFileArr.push(nameFileMain);
      }
    }
  } catch (error) {
    console.log('Error download file', error);
  }
  return {filePlay, exist};
};

export const soundStop = (soundVar: any) => {
  if (soundVar) {
    soundVar.reset();
    soundVar.release();
    soundVar.stop();
  }
};

export const sound = (file?: string, completeSound?: any, options?: any) => {
  if (!file) {
    return;
  }
  const soundVar = new Sound(file, '', (error) => {
    if (error) {
      console.log(`er play sound: ${file} ${JSON.stringify(error)}`);
      return;
    }
    if (!!options?.loop) {
      soundVar.setNumberOfLoops(-1);
    }
    if (options?.volume != undefined) {
      if (preVolume == -1) {
        preVolume = options?.volume;
      }
      soundVar.setVolume(options?.volume);
    }
    soundVar.play(() => {
      soundVar.reset();
      soundVar.release();
      completeSound && completeSound();
    });
  });
  return {
    soundVar,
    soundStop: () => soundStop(soundVar),
  };
};

export const soundLocalOrUri = async (
  file: string,
  completeSound?: any,
  options?: any,
) => {
  const filePlay: any = (await cacheFile(file)).filePlay;
  return sound(filePlay, completeSound, options); // Lưu ý chỗ này return về promise
};
export const soundApi = (
  text: string,
  language?: string,
  complete?: () => void,
  completeApi?: (uri: string) => void,
) => {
  let cancelRequest;
  const paramTalk = {text: text, lang: language || 'vi'};
  const cancelToken = {
    cancelToken: new axios.CancelToken(function executor(c) {
      cancelRequest = c;
    }),
  };
  const md5Text = md5(`${language}_${text}`);
  cacheFile('', md5Text).then(({filePlay, exist}) => {
    if (exist) {
      _stopSoundApi = sound(filePlay, complete)?.soundStop;
    } else {
      axios
        .post(pathUrl + 'talk', paramTalk, cancelToken)
        .then((res) => {
          cacheFile(pathUrl + res.data.url, md5(`${language}_${text}`));
          if (completeApi) {
            completeApi(pathUrl + res.data.url);
            return;
          }
          _stopSoundApi = sound(pathUrl + res.data.url, complete)?.soundStop;
          console.log('soundApi success');
        })
        .catch((err) => {
          console.log('soundApi error', err);
          complete && complete();
        });
    }
  });

  return cancelRequest;
};
