import './blots/image';

import './quill.imageUploader.css';

class ImageUploader {
	constructor(quill, options) {
		this.quill = quill;
		this.options = options;
		this.range = null;

		if (typeof this.options.upload !== 'function')
			console.warn(
				'[Missing config] upload function that returns a promise is required'
			);

		var toolbar = this.quill.getModule('toolbar');
		toolbar.addHandler('image', this.selectLocalImage.bind(this));
	}

	selectLocalImage() {
		this.range = this.quill.getSelection();
		this.fileHolder = document.createElement('input');
		this.fileHolder.setAttribute('type', 'file');
		this.fileHolder.setAttribute('accept', 'image/jpg, image/jpeg, image/png, image/gif');
		this.fileHolder.setAttribute('style', 'visibility:hidden');

		this.fileHolder.onchange = this.fileChanged.bind(this);

		document.body.appendChild(this.fileHolder);

		this.fileHolder.click();

		window.requestAnimationFrame(() => {
			document.body.removeChild(this.fileHolder);
		});
	}

	fileChanged() {
		const file = this.fileHolder.files[0];

		const fileReader = new FileReader();

		fileReader.addEventListener(
			'load',
			() => {
				if (this.options.noPreviewOnChange == undefined || !this.options.noPreviewOnChange) {
					this.insertBase64Image('data:image/png;base64,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');
				}
			},
			false
		);

		if (file) {
			fileReader.readAsDataURL(file);
		}

		this.options.upload(file).then(
			imageUrl => {
				this.insertToEditor(imageUrl);
			},
			error => {
				console.warn(error.message);
			}
		);
	}

	insertBase64Image(url) {
		const range = this.range;
		this.quill.insertEmbed(range.index, 'imageBlot', `${url}`);
	}

	insertToEditor(url) {
		const range = this.range;
		// Delete the placeholder image
		this.quill.deleteText(range.index, 2);
		// Insert the server saved image
		this.quill.insertEmbed(range.index, 'image', `${url}`);

		range.index++;
		this.quill.setSelection(range, 'api');
	}
}

export default ImageUploader;
