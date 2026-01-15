import { THeader } from '@/context/headerContext';
import { TSidebar, TSidebarContent } from '@/context/sidebarContext';
import { TMainSection } from '@/context/mainSectionContext';

/**
 * Validates that the header has the correct structure
 */
function validateHeader(header: unknown): asserts header is THeader {
	if (!header || typeof header !== 'object') {
		throw new Error('Invalid file structure: Header must be an object');
	}
	const h = header as Record<string, unknown>;
	
	if (!Array.isArray(h.content)) {
		throw new Error('Invalid file structure: Header.content must be an array');
	}
	
	if (typeof h.name !== 'string') {
		throw new Error('Invalid file structure: Header.name must be a string');
	}
	
	if (typeof h.img !== 'string') {
		throw new Error('Invalid file structure: Header.img must be a string');
	}
	
	// Validate content items
	h.content.forEach((item, index) => {
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
}

/**
 * Adds IDs to header content items if they don't have them
 */
export function migrateHeader(header: THeader): THeader {
	validateHeader(header);
	
	return {
		...header,
		content: header.content.map((item) => {
			// Check if item already has an id (for backward compatibility)
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

/**
 * Validates that the sidebar has the correct structure
 */
function validateSidebar(sidebar: unknown): asserts sidebar is TSidebar[] {
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
		
		// Validate content items
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
}

/**
 * Adds IDs to sidebar sections and content items if they don't have them
 */
type LegacySidebarSection = {
	id?: string;
	content: unknown[];
	title: string;
};

type LegacyGridItem = string | { id?: string; value?: string };

export function migrateSidebar(sidebar: TSidebar[]): TSidebar[] {
	validateSidebar(sidebar);
	
	return sidebar.map((section) => {
		const sectionWithId = section as unknown as LegacySidebarSection;
		return {
			...section,
			id: (sectionWithId.id && typeof sectionWithId.id === 'string') ? sectionWithId.id : crypto.randomUUID(),
			content: section.content.map((item) => {
				// Check if item already has an id (for backward compatibility)
				const itemWithId = item as unknown as Record<string, unknown>;
				if (itemWithId.id && typeof itemWithId.id === 'string') {
					// If it's a grid item, check if grid items have IDs
					if (item.type === 'grid') {
						const gridContent = item.content as unknown[];
					// Check if grid items are strings (old format) or objects (new format)
					if (Array.isArray(gridContent) && gridContent.length > 0 && typeof gridContent[0] === 'string') {
						// Convert string array to object array with IDs
						return {
							...item,
							content: (gridContent as string[]).map((value: string) => ({
								id: crypto.randomUUID(),
								value,
							})),
						} as TSidebarContent;
						}
						// Grid items already have IDs, but check each one
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
				// Add id to item based on its type
				if (item.type === 'grid') {
					const gridContent = item.content as unknown[];
					// Check if grid items are strings (old format) or objects (new format)
					if (Array.isArray(gridContent) && gridContent.length > 0 && typeof gridContent[0] === 'string') {
						// Convert string array to object array with IDs
						return {
							...item,
							id: crypto.randomUUID(),
							content: (gridContent as string[]).map((value: string) => ({
								id: crypto.randomUUID(),
								value,
							})),
						} as TSidebarContent;
					}
					// Grid items might already be objects but without IDs
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

/**
 * Validates that the main section has the correct structure
 */
function validateMainSection(sections: unknown): asserts sections is TMainSection[] {
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
		
		if (typeof sectionObj.hidden !== 'boolean') {
			throw new Error(`Invalid file structure: MainSection[${sectionIndex}].hidden must be a boolean`);
		}
		
		if (sectionObj.icon !== undefined && typeof sectionObj.icon !== 'string') {
			throw new Error(`Invalid file structure: MainSection[${sectionIndex}].icon must be a string`);
		}
		
		if (!Array.isArray(sectionObj.content)) {
			throw new Error(`Invalid file structure: MainSection[${sectionIndex}].content must be an array`);
		}
		
		// Validate content items
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
}

/**
 * Adds IDs to main sections and content items if they don't have them
 */
export function migrateMainSection(sections: TMainSection[]): TMainSection[] {
	validateMainSection(sections);
	
	return sections.map((section) => {
		// Check if section already has an id (for backward compatibility)
		const sectionWithId = section as unknown as Record<string, unknown>;
		const sectionId = (sectionWithId.id && typeof sectionWithId.id === 'string') ? section.id : crypto.randomUUID();
		
		return {
			...section,
			id: sectionId,
			content: section.content.map((item) => {
				// Check if item already has an id (for backward compatibility)
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
