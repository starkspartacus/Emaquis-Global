const ALIGN = {
	LEFT: 'left',
	CENTER: 'center',
	RIGHT: 'right',
};

const TICKET_TEMPLATE = {
	order_details: {
		columns: [
			{
				header: 'Qte',
				length: 5,
				maxText: 5,
				align: ALIGN.LEFT,
			},
			{
				header: 'Produit',
				length: 17,
				maxText: 17,
				align: ALIGN.LEFT,
			},
			{
				header: null,
				length: 1,
				maxText: 1,
				align: ALIGN.CENTER,
			},
			{
				header: 'P.U',
				length: 4,
				maxText: 4,
				align: ALIGN.LEFT,
			},
			{
				header: 'Total',
				length: 5,
				maxText: 5,
				align: ALIGN.RIGHT,
			},
		],
	},
};

const FULL_MODE = 1;
const SUMMARY_MODE = 2;

const MAX_CHARACTER_FONT_A = 28;

class TicketGenerator {
	_max_character_font_a = MAX_CHARACTER_FONT_A;
	constructor(max_character = MAX_CHARACTER_FONT_A) {
		this._max_character_font_a = max_character;
	}

	spaceBetweenTexts(leftText, rightText) {
		//this._encoder.size('normal');

		let totalTextCharacters = leftText.length + rightText.length;
		if (totalTextCharacters > this._max_character_font_a) {
			leftText += ' ';
			rightText = rightText.substr(
				0,
				this._max_character_font_a - leftText.length
			);
			totalTextCharacters = this._max_character_font_a;
		}

		let str =
			leftText +
			' '.repeat(this._max_character_font_a - totalTextCharacters) +
			rightText;

		return str;
	}

	centerText(text) {
		return this.alignOnMaxCharacter(text, this._max_character_font_a, 'center');
	}

	leftText(text) {
		return this.alignOnMaxCharacter(text, this._max_character_font_a, 'left');
	}

	rightText(text) {
		return this.alignOnMaxCharacter(text, this._max_character_font_a, 'right');
	}

	/**
	 * Slice text with one extra space if needed
	 * @param {string} text
	 * @param {Number} max
	 * @param {boolean} addOneSpace
	 * @returns {string|*}
	 */
	ellipseText(text, max, addOneSpace = 0) {
		if (text && text.length > max) {
			return text.slice(0, max - addOneSpace) + ' '.repeat(addOneSpace);
		}
		return text ?? '';
	}

	/**
	 * Align text on a defined length without wrapping text
	 * Eg.: 'Hello' align center on 10 => '  Hello   ', on left => 'Hello     '
	 * @param {string} text
	 * @param {Number} max
	 * @param {string} align
	 * @returns {string}
	 */
	alignOnMaxCharacter(text, max, align = ALIGN.LEFT) {
		text = this.ellipseText(text, max);
		switch (align) {
			case ALIGN.LEFT:
				text = text.padEnd(max, ' ');
				break;
			case ALIGN.CENTER:
				text = text
					.padStart(text.length + Math.floor((max - text.length) / 2), ' ')
					.padEnd(max, ' ');
				break;
			case ALIGN.RIGHT:
				text = text.padStart(max, ' ');
				break;
		}

		return text;
	}

	generateHeadersBasedOnTemplateText(template = TICKET_TEMPLATE.order_details) {
		if (template.hasOwnProperty('columns')) {
			const text = template.columns.reduce(
				(text, column) =>
					text +
					this.alignOnMaxCharacter(
						this.getTranslationEllipse(column.header, column.maxText),
						column.length,
						column.align
					),
				''
			);
			return text;
		}

		return '';
	}

	generateLineBasedOnTemplateText(
		values,
		template = TICKET_TEMPLATE.order_details,
		depth = 0
	) {
		if (
			template.hasOwnProperty('columns') &&
			template.columns.length === values.length
		) {
			const text = template.columns.reduce((text, column, idx) => {
				const config = this.getDepthConfig(column, 0, depth);
				const t =
					(config.hasOwnProperty('tab') ? ' '.repeat(config.tab) : '') +
					this.ellipseText(values[idx]?.toString() ?? '', config.maxText);
				return text + this.alignOnMaxCharacter(t, column.length, config.align);
			}, '');
			return text;
		}

		return '';
	}

	getDepthConfig(columnConfig, currentDepth = 0, maxDepth) {
		if (currentDepth < maxDepth && columnConfig.hasOwnProperty('child')) {
			return this.getDepthConfig(
				columnConfig.child,
				currentDepth + 1,
				maxDepth
			);
		}

		return columnConfig;
	}

	/**
	 * Get the translated string or raw string
	 * @param {string} text
	 * @param {Number} max
	 * @returns {string}
	 */
	getTranslationEllipse(text, max) {
		if (text && text.length) {
			return this.ellipseText(text, max);
		}

		return text ?? '';
	}
}

const generatorTicket = new TicketGenerator(32);

exports.generatorTicket = generatorTicket;
