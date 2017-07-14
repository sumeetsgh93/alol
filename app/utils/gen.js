import {AsyncStorage} from 'react-native';
import {USER_TOKEN, PLAY_STORE_URL} from '../constants';
import Share, {ShareSheet, Button} from 'react-native-share';
import RNFetchBlob from 'react-native-fetch-blob';
const fs = RNFetchBlob.fs;

export default class Gen {

	static isDevelopment() {
		return true;
	}

	static isServer() {
		return false;
	}

	static isProduction() {
		return false;
	}

	static getBaseUrl() {
		return Gen.isDevelopment() ? 'https://quicknodeserver.herokuapp.com' : 'https://lolmenow.com';
	}

	static getDisplayTime(time) {
		const date = new Date(time);
		const currentDate = new Date();
		let displayTime = 'just now';
		let diff = currentDate.getTime() - date.getTime();
		diff = Math.floor(diff / 1000);
		if (diff > 0) {
			displayTime = diff > 1 ? `${diff} seconds ago` : '1 second ago';
		}
		diff = Math.floor(diff / 60);
		if (diff > 0) {
			displayTime = diff > 1 ? `${diff} minutes ago` : '1 minute ago';
		}
		diff = Math.floor(diff / 60);
		if (diff > 0) {
			displayTime = diff > 1 ? `${diff} hours ago` : '1 hour ago';
		}
		diff = Math.floor(diff / 24);
		if (diff > 0) {
			displayTime = diff > 1 ? `${diff} days ago` : '1 day ago';
		}
		diff = Math.floor(diff / 30);
		if (diff > 0) {
			displayTime = diff > 1 ? `${diff} months ago` : '1 month ago';
		}
		diff = Math.floor(diff / 12);
		if (diff > 0) {
			displayTime = diff > 1 ? `${diff} years ago` : '1 year ago';
		}
		return displayTime;
	}

	static getAuth() {
		return {
			headers: {
				Authorization: '',
			},
		};
	}

	static isLogEnabled() {
		return true;
	}

	static log(...printStatement) {
		if (this.isLogEnabled() && this.isDevelopment()) {
			console.log(...printStatement);
		}
	}

    // merge two arrays a1 and a2 based on _id key.. maintain the order of elements as well
	static merge(a1, a2) {
		const hash = new Map();
		a1.concat(a2).forEach((obj) => {
			hash.set(obj._id, Object.assign(hash.get(obj._id) || {}, obj));
		});
		return Array.from(hash.values());
	}

	static getUserReactionCount({userReaction, type}) {
		return userReaction ? userReaction[type] : null;
	}

	static max(a, b) {
		return a > b ? a : b;
	}

	static deepClone(obj) {
		return JSON.parse(JSON.stringify(obj));
	}

	static isSignedIn() {
		return new Promise((resolve, reject) => {
			AsyncStorage.getItem(USER_TOKEN)
                .then(res => {
	if (res !== null) {
		resolve(true);
	} else {
		resolve(false);
	}
})
                .catch(err => reject(err));
		});
	}

	static onSignIn(userToken) {
		return AsyncStorage.setItem(USER_TOKEN, userToken);
	}

	static onSignOut() {
		return AsyncStorage.removeItem(USER_TOKEN);
	}

	// TODO: fix this for facebook messenger, right as of now it is only sharing image and no desc.
	static shareImage(url) {
		let imagePath = null;
		RNFetchBlob
            .config({
                fileCache: true,
            })
            .fetch('GET', url)
            .then((resp) => {
                imagePath = resp.path();
                return resp.readFile('base64');
            })
            .then((base64Data) => {
		    // TODO: as of now we are hard-coding jpeg image. If the image is png, this is a problem
                base64Data = `data:image/jpeg;base64,${base64Data}`;
                Share.open({url: base64Data,
                    message: PLAY_STORE_URL})
                    .catch((err) => { err && Gen.log(err); });
                return fs.unlink(imagePath);
});
	}

	static getFileFormat(file) {

    }
}
