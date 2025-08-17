export interface NoteSummary {
	letters: number;
	words: number;
	paragraphs: number;
	sentences: number;
}

export function getNoteSummary(html: string): NoteSummary {
	const text = html
		.replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
		.replace(/\s+/g, " ") // Normalize whitespace
		.trim();

	return {
		letters: countCharacters(text),
		words: countWords(text),
		paragraphs: countParagraphs(text),
		sentences: countSentences(text),
	};
}

/* Helpers */
function countWords(text: string): number {
	return text.trim().split(/\s+/).filter(Boolean).length;
}

function countSentences(text: string): number {
	return text.split(/[.!?]+/).filter(Boolean).length;
}

function countParagraphs(text: string): number {
	return text.split(/\n{2,}/).filter((p) => p.trim()).length;
}

function countCharacters(text: string): number {
	return text.length;
}
