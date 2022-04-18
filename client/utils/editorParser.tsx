import { OutputBlockData, OutputData } from '@editorjs/editorjs';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { data } from '../data';

export const editorParser = (block: OutputBlockData) => {
	switch (block.type) {
		case 'paragraph':
			return editorCases().paragraph(block);
		case 'list':
			return editorCases().list(block);
		case 'header':
			return editorCases().header(block);
		case 'delimiter':
			return editorCases().delimiter(block);
		case 'quote':
			return editorCases().quote(block);
		case 'image':
			return editorCases().image(block);
		case 'embed':
			return editorCases().embed(block);
		default:
			break;
	}
};

export const toBase64 = (str: string) =>
	typeof window === 'undefined'
		? Buffer.from(str).toString('base64')
		: window.btoa(str);

export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

export const editorCases = () => ({
	image(block: OutputBlockData) {
		return (
			<motion.div
				key={block.id}
				style={{
					display: 'flex',
					flexDirection: 'column',
					position: 'relative',
				}}
			>
				<p>{block.data.caption && block.data.caption}</p>
				<motion.div
					className='image'
					style={{
						display: 'flex',
						position: 'relative',
						maxHeight: '400px',
						minHeight: '360px',
					}}
				>
					<Image
						src={block.data.file.url}
						alt={block.data.caption && block.data.caption}
						layout='fill'
						objectFit='contain'
						objectPosition={'center center'}
						quality={50}
						placeholder='blur'
						blurDataURL={`data:image/svg+xml;base64,${toBase64(
							shimmer(700, 475)
						)}`}
					/>
				</motion.div>
			</motion.div>
		);
	},
	embed(block: OutputBlockData) {
		return (
			<div
				key={block.id}
				style={{
					display: 'flex',
					position: 'relative',
					maxHeight: '400px',
					minHeight: '360px',
				}}
			>
				<iframe
					width='540px'
					height='360px'
					src={`${block.data.embed}`}
					frameBorder='0'
					allow='autoplay; encrypted-media'
					allowFullScreen
				></iframe>
			</div>
		);
	},
	delimiter(block: OutputBlockData) {
		return (
			<p
				key={block.id}
				style={{ textAlign: 'center' }}
				className='delimetr'
			>{`${'\u002A'} ${'\u002A'} ${'\u002A'}`}</p>
		);
	},
	paragraph(block: OutputBlockData) {
		return (
			<p
				className='paragraph'
				key={block.id}
				dangerouslySetInnerHTML={{
					__html: block.data.text,
				}}
			/>
		);
	},
	quote(block: OutputBlockData) {
		return (
			<div
				className='quote'
				key={block.id}
				style={
					block?.data?.alignment === 'center'
						? { textAlign: 'center' }
						: { textAlign: 'left' }
				}
			>
				{block.data.text && (
					<q
						dangerouslySetInnerHTML={{
							__html: block.data.text,
						}}
					/>
				)}
				{block.data.caption && (
					<h5
						dangerouslySetInnerHTML={{
							__html: block.data.caption,
						}}
					/>
				)}
			</div>
		);
	},
	list(block: OutputBlockData) {
		if (block.data.style === 'unordered') {
			return (
				<ul
					className='listUnordered'
					key={block.id}
					style={{
						listStyleType: 'revert',
						listStylePosition: 'inside',
					}}
				>
					{block.data.items.map((item: string, index: number) => (
						<li
							style={{ listStyleType: 'inherit' }}
							key={`${block.id}${index}`}
							dangerouslySetInnerHTML={{
								__html: item,
							}}
						/>
					))}
				</ul>
			);
		} else {
			return (
				<ol
					className='listOrdered'
					key={block.id}
					style={{
						listStyleType: 'auto',
						listStylePosition: 'inside',
						padding: '0',
					}}
				>
					{block.data.items.map((item: string, index: number) => (
						<li
							style={{ listStyleType: 'inherit' }}
							key={`${block.id}${index}`}
							dangerouslySetInnerHTML={{
								__html: item,
							}}
						/>
					))}
				</ol>
			);
		}
	},
	header(block: OutputBlockData) {
		const level = block.data.level;
		const text = block.data.text;
		switch (level) {
			case 1:
				return (
					<h1
						className='header1'
						style={{ textAlign: 'center' }}
						key={`${level}${text}`}
						dangerouslySetInnerHTML={{ __html: text }}
					/>
				);
			case 2:
				return (
					<h2
						className='header2'
						style={{ textAlign: 'center' }}
						key={`${level}${text}`}
						dangerouslySetInnerHTML={{ __html: text }}
					/>
				);
			case 3:
				return (
					<h3
						className='header3'
						style={{ textAlign: 'center' }}
						key={`${level}${text}`}
						dangerouslySetInnerHTML={{ __html: text }}
					/>
				);
			case 4:
				return (
					<h4
						className='header4'
						style={{ textAlign: 'center' }}
						key={`${level}${text}`}
						dangerouslySetInnerHTML={{ __html: text }}
					/>
				);
			case 5:
				return (
					<h5
						className='header5'
						style={{ textAlign: 'center' }}
						key={`${level}${text}`}
						dangerouslySetInnerHTML={{ __html: text }}
					/>
				);
			case 6:
				return (
					<h6
						className='header6'
						style={{ textAlign: 'center' }}
						key={`${level}${text}`}
						dangerouslySetInnerHTML={{ __html: text }}
					/>
				);
			default:
				return (
					<h2
						className='header2'
						style={{ textAlign: 'center' }}
						key={`${level}${text}`}
						dangerouslySetInnerHTML={{ __html: text }}
					/>
				);
		}
	},
});
