import React, { FC, useEffect } from 'react';
import { Api, baseUrl } from '../../utils/api';
import EditorJS, { OutputBlockData, OutputData } from '@editorjs/editorjs';
// @ts-ignore There is no types for this package.
import Header from '@editorjs/header';
// @ts-ignore There is no types for this package.
import ImageTool from '@editorjs/image';
// @ts-ignore There is no types for this package.
import Paragraph from '@editorjs/paragraph';
// @ts-ignore There is no types for this package.
import Delimiter from '@editorjs/delimiter';
// @ts-ignore There is no types for this package.
import Quote from '@editorjs/quote';
// @ts-ignore There is no types for this package.
import List from '@editorjs/list';
// @ts-ignore There is no types for this package.
import Embed from '@editorjs/embed';
// @ts-ignore There is no types for this package.
// import Marker from '@editorjs/marker';

interface EditorProps {
	onChange: (blocks: OutputData['blocks']) => void;
	initialBlocks?: OutputData['blocks'];
}
const Editor: FC<EditorProps> = ({ onChange, initialBlocks }) => {
	useEffect(() => {
		const editor = new EditorJS({
			holder: 'editor',
			data: { blocks: initialBlocks || [] },
			autofocus: false,
			minHeight: 100,
			placeholder: 'Начните писать вашу статью',
			async onChange() {
				const { blocks } = await editor.save();
				onChange(blocks);
			},
			inlineToolbar: true,

			tools: {
				paragraph: {
					class: Paragraph,
				},
				header: {
					class: Header,
					config: {
						placeholder: 'Enter a header',
						levels: [2, 3, 4, 5, 6],
						defaultLevel: 2,
					},
				},
				list: {
					class: List,
					inlineToolbar: true,
				},
				image: {
					class: ImageTool,
					config: {
						uploader: {
							/**
							 * @param {File} picture
							 * @return {Promise.<{success, file: {url}}>}
							 */
							uploadByFile(picture: any) {
								const formData = new FormData();
								formData.append('picture', picture as Blob);
								return Api()
									.post.uploadPostImage(formData)
									.then((data) => {
										return {
											success: 1,
											file: {
												url: `${data.url}`,
												filePath: `${data.filePath}`,
												newFile: true,
												fileName: `${data.fileName}`,
												filePathWithoutDir: `${data.filePathWithoutDir}`,
												fileDir: `${data.fileDir}`,
											},
										};
									});
							},
						},
					},
				},
				delimiter: { class: Delimiter },
				quote: {
					class: Quote,
					config: {
						quotePlaceholder: 'Кавычки',
					},
				},
				embed: {
					class: Embed,
					inlineToolbar: true,
					config: {
						services: {
							youtube: true,
							height: 300,
							width: 600,
						},
					},
				},
				// Marker: {
				// 	class: Marker,
				// },
			},
		});

		(async () => {
			try {
				await editor.isReady;
				console.log('Editor is ready to work!');
			} catch (reason) {
				console.log(
					`Editor initialization failed because of ${reason}`
				);
			}
		})();

		return () => {
			editor.isReady
				.then(() => {
					editor.destroy();
				})
				.catch((e) => console.log('Editor error', e));
		};
	}, []);

	return <div id='editor' />;
};

export default Editor;
