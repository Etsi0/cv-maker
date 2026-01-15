import { THeader } from '@/context/headerContext';
import { TSidebar, TSidebarContent } from '@/context/sidebarContext';
import { TMainSection } from '@/context/mainSectionContext';
import { tryCatch } from '@/lib/util';

// Header migrations
function migrateHeader_20260101(header: unknown): THeader {
	if (!header || typeof header !== 'object') {
		throw new Error('Invalid file structure: Header must be an object');
	}
	const headerObj = header as Record<string, unknown>;
	
	if (!Array.isArray(headerObj.content)) {
		throw new Error('Invalid file structure: Header.content must be an array');
	}
	
	if (typeof headerObj.name !== 'string') {
		throw new Error('Invalid file structure: Header.name must be a string');
	}
	
	if (typeof headerObj.img !== 'string') {
		throw new Error('Invalid file structure: Header.img must be a string');
	}
	
	headerObj.content.forEach((item, index) => {
		if (!item || typeof item !== 'object') {
			throw new Error(`Invalid file structure: Header.content[${index}] must be an object`);
		}
		const itemObj = item as Record<string, unknown>;
		if (typeof itemObj.text !== 'string') {
			throw new Error(`Invalid file structure: Header.content[${index}].text must be a string`);
		}
		if (itemObj.icon !== undefined && typeof itemObj.icon !== 'string') {
			throw new Error(`Invalid file structure: Header.content[${index}].icon must be a string`);
		}
	});
	
	const typedHeader = headerObj as THeader;
	
	return {
		...typedHeader,
		content: typedHeader.content.map((item) => {
			const itemWithId = item as Record<string, unknown>;
			if (itemWithId.id && typeof itemWithId.id === 'string') {
				return item;
			}
			return {
				...item,
				id: crypto.randomUUID(),
			};
		}),
	};
}

export function migrateHeader(header: unknown): THeader {
	const [error, data] = tryCatch(() => migrateHeader_20260101(header));
	if (error) {
		// If latest migration fails, try previous versions
		// For now, just re-throw since this is the first migration
		throw error;
	}
	return data;
}

// Sidebar migrations
function migrateSidebar_20260101(sidebar: unknown): TSidebar[] {
	if (!Array.isArray(sidebar)) {
		throw new Error('Invalid file structure: Sidebar must be an array');
	}
	
	sidebar.forEach((section, sectionIndex) => {
		if (!section || typeof section !== 'object') {
			throw new Error(`Invalid file structure: Sidebar[${sectionIndex}] must be an object`);
		}
		const sectionObj = section as Record<string, unknown>;
		
		if (typeof sectionObj.title !== 'string') {
			throw new Error(`Invalid file structure: Sidebar[${sectionIndex}].title must be a string`);
		}
		
		if (!Array.isArray(sectionObj.content)) {
			throw new Error(`Invalid file structure: Sidebar[${sectionIndex}].content must be an array`);
		}
		
		sectionObj.content.forEach((item, itemIndex) => {
			if (!item || typeof item !== 'object') {
				throw new Error(`Invalid file structure: Sidebar[${sectionIndex}].content[${itemIndex}] must be an object`);
			}
			const itemObj = item as Record<string, unknown>;
			
			if (typeof itemObj.type !== 'string') {
				throw new Error(`Invalid file structure: Sidebar[${sectionIndex}].content[${itemIndex}].type must be a string`);
			}
			
			if (!['text', 'link', 'grid'].includes(itemObj.type)) {
				throw new Error(`Invalid file structure: Sidebar[${sectionIndex}].content[${itemIndex}].type must be 'text', 'link', or 'grid'`);
			}
			
			if (itemObj.type === 'text' && typeof itemObj.content !== 'string') {
				throw new Error(`Invalid file structure: Sidebar[${sectionIndex}].content[${itemIndex}].content must be a string for type 'text'`);
			}
			
			if (itemObj.type === 'link') {
				if (!itemObj.content || typeof itemObj.content !== 'object') {
					throw new Error(`Invalid file structure: Sidebar[${sectionIndex}].content[${itemIndex}].content must be an object for type 'link'`);
				}
				const linkContent = itemObj.content as Record<string, unknown>;
				if (typeof linkContent.text !== 'string' || typeof linkContent.href !== 'string') {
					throw new Error(`Invalid file structure: Sidebar[${sectionIndex}].content[${itemIndex}].content must have 'text' and 'href' strings for type 'link'`);
				}
			}
			
			if (itemObj.type === 'grid' && !Array.isArray(itemObj.content)) {
				throw new Error(`Invalid file structure: Sidebar[${sectionIndex}].content[${itemIndex}].content must be an array for type 'grid'`);
			}
		});
	});
	
	const typedSidebar = sidebar as TSidebar[];
	
	type LegacySidebarSection = {
		id?: string;
		content: unknown[];
		title: string;
	};

	type LegacyGridItem = string | { id?: string; value?: string };
	
	return typedSidebar.map((section) => {
		const sectionWithId = section as unknown as LegacySidebarSection;
		return {
			...section,
			id: (sectionWithId.id && typeof sectionWithId.id === 'string') ? sectionWithId.id : crypto.randomUUID(),
			content: section.content.map((item) => {
				const itemWithId = item as unknown as Record<string, unknown>;
				if (itemWithId.id && typeof itemWithId.id === 'string') {
					if (item.type === 'grid') {
						const gridContent = item.content as unknown[];
						if (Array.isArray(gridContent) && gridContent.length > 0 && typeof gridContent[0] === 'string') {
							return {
								...item,
								content: (gridContent as string[]).map((value: string) => ({
									id: crypto.randomUUID(),
									value,
								})),
							} as TSidebarContent;
						}
						const migratedGrid = (gridContent as LegacyGridItem[]).map((gridItem) => {
							if (typeof gridItem === 'string') {
								return { id: crypto.randomUUID(), value: gridItem };
							}
							const gridItemObj = gridItem as Record<string, unknown>;
							if (gridItemObj.id && typeof gridItemObj.id === 'string') {
								return gridItem as { id: string; value: string };
							}
							return { id: crypto.randomUUID(), value: (gridItemObj.value && typeof gridItemObj.value === 'string') ? gridItemObj.value : '' };
						});
						return {
							...item,
							content: migratedGrid,
						} as TSidebarContent;
					}
					return item;
				}
				if (item.type === 'grid') {
					const gridContent = item.content as unknown[];
					if (Array.isArray(gridContent) && gridContent.length > 0 && typeof gridContent[0] === 'string') {
						return {
							...item,
							id: crypto.randomUUID(),
							content: (gridContent as string[]).map((value: string) => ({
								id: crypto.randomUUID(),
								value,
							})),
						} as TSidebarContent;
					}
					const migratedGrid = (gridContent as LegacyGridItem[]).map((gridItem) => {
						if (typeof gridItem === 'string') {
							return { id: crypto.randomUUID(), value: gridItem };
						}
						const gridItemObj = gridItem as Record<string, unknown>;
						if (gridItemObj.id && typeof gridItemObj.id === 'string') {
							return gridItem as { id: string; value: string };
						}
						return { id: crypto.randomUUID(), value: (gridItemObj.value && typeof gridItemObj.value === 'string') ? gridItemObj.value : '' };
					});
					return {
						...item,
						id: crypto.randomUUID(),
						content: migratedGrid,
					} as TSidebarContent;
				}
				return {
					...item,
					id: crypto.randomUUID(),
				} as TSidebarContent;
			}),
		};
	});
}

export function migrateSidebar(sidebar: unknown): TSidebar[] {
	const [error, data] = tryCatch(() => migrateSidebar_20260101(sidebar));
	if (error) {
		// If latest migration fails, try previous versions
		// For now, just re-throw since this is the first migration
		throw error;
	}
	return data;
}

// MainSection migrations
function migrateMainSection_20260101(sections: unknown): TMainSection[] {
	if (!Array.isArray(sections)) {
		throw new Error('Invalid file structure: MainSection must be an array');
	}
	
	sections.forEach((section, sectionIndex) => {
		if (!section || typeof section !== 'object') {
			throw new Error(`Invalid file structure: MainSection[${sectionIndex}] must be an object`);
		}
		const sectionObj = section as Record<string, unknown>;
		
		if (typeof sectionObj.title !== 'string') {
			throw new Error(`Invalid file structure: MainSection[${sectionIndex}].title must be a string`);
		}
		
		if (typeof sectionObj.type !== 'string') {
			throw new Error(`Invalid file structure: MainSection[${sectionIndex}].type must be a string`);
		}
		
		if (!['default', 'card'].includes(sectionObj.type)) {
			throw new Error(`Invalid file structure: MainSection[${sectionIndex}].type must be 'default' or 'card'`);
		}
		
		if (typeof sectionObj.hidden !== 'boolean' && typeof sectionObj.hidden !== 'number') {
			throw new Error(`Invalid file structure: MainSection[${sectionIndex}].hidden must be a boolean or number`);
		}
		
		if (sectionObj.icon !== undefined && typeof sectionObj.icon !== 'string') {
			throw new Error(`Invalid file structure: MainSection[${sectionIndex}].icon must be a string`);
		}
		
		if (!Array.isArray(sectionObj.content)) {
			throw new Error(`Invalid file structure: MainSection[${sectionIndex}].content must be an array`);
		}
		
		sectionObj.content.forEach((item, itemIndex) => {
			if (!item || typeof item !== 'object') {
				throw new Error(`Invalid file structure: MainSection[${sectionIndex}].content[${itemIndex}] must be an object`);
			}
			const itemObj = item as Record<string, unknown>;
			
			if (typeof itemObj.title !== 'string') {
				throw new Error(`Invalid file structure: MainSection[${sectionIndex}].content[${itemIndex}].title must be a string`);
			}
			
			if (typeof itemObj.subTitle !== 'string') {
				throw new Error(`Invalid file structure: MainSection[${sectionIndex}].content[${itemIndex}].subTitle must be a string`);
			}
			
			if (typeof itemObj.text !== 'string') {
				throw new Error(`Invalid file structure: MainSection[${sectionIndex}].content[${itemIndex}].text must be a string`);
			}
		});
	});
	
	return sections.map((section) => {
		const sectionObj = section as Record<string, unknown>;
		const sectionId = (sectionObj.id && typeof sectionObj.id === 'string') ? sectionObj.id : crypto.randomUUID();
		
		const sectionHidden = sectionObj.hidden;
		const hidden = typeof sectionHidden === 'number' ? sectionHidden !== 0 : (sectionHidden as boolean);
		
		const typedSection = section as TMainSection;
		
		return {
			...typedSection,
			id: sectionId,
			hidden,
			content: typedSection.content.map((item) => {
				const itemWithId = item as unknown as Record<string, unknown>;
				if (itemWithId.id && typeof itemWithId.id === 'string') {
					return item;
				}
				return {
					...item,
					id: crypto.randomUUID(),
				};
			}),
		};
	});
}

export function migrateMainSection(sections: unknown): TMainSection[] {
	const [error, data] = tryCatch(() => migrateMainSection_20260101(sections));
	if (error) {
		// If latest migration fails, try previous versions
		// For now, just re-throw since this is the first migration
		throw error;
	}
	return data;
}
