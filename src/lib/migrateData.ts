import { THeader } from '@/context/headerContext';
import { TSidebar, TSidebarContent } from '@/context/sidebarContext';
import { TMainSection } from '@/context/mainSectionContext';

/**
 * Adds IDs to header content items if they don't have them
 */
export function migrateHeader(header: THeader): THeader {
	return {
		...header,
		content: header.content.map((item) => {
			// Check if item already has an id (for backward compatibility)
			const itemWithId = item as any;
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
 * Adds IDs to sidebar sections and content items if they don't have them
 */
export function migrateSidebar(sidebar: TSidebar[]): TSidebar[] {
	return sidebar.map((section) => ({
		...section,
		id: (section as any).id || crypto.randomUUID(),
		content: section.content.map((item) => {
			// Check if item already has an id (for backward compatibility)
			const itemWithId = item as any;
			if (itemWithId.id && typeof itemWithId.id === 'string') {
				// If it's a grid item, check if grid items have IDs
				if (item.type === 'grid') {
					const gridContent = item.content as any;
					// Check if grid items are strings (old format) or objects (new format)
					if (Array.isArray(gridContent) && gridContent.length > 0 && typeof gridContent[0] === 'string') {
						// Convert string array to object array with IDs
						return {
							...item,
							content: gridContent.map((value: string) => ({
								id: crypto.randomUUID(),
								value,
							})),
						} as TSidebarContent;
					}
					// Grid items already have IDs, but check each one
					const migratedGrid = gridContent.map((gridItem: any) => {
						if (typeof gridItem === 'string') {
							return { id: crypto.randomUUID(), value: gridItem };
						}
						if (gridItem.id && typeof gridItem.id === 'string') {
							return gridItem;
						}
						return { id: crypto.randomUUID(), value: gridItem.value || '' };
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
				const gridContent = item.content as any;
				// Check if grid items are strings (old format) or objects (new format)
				if (Array.isArray(gridContent) && gridContent.length > 0 && typeof gridContent[0] === 'string') {
					// Convert string array to object array with IDs
					return {
						...item,
						id: crypto.randomUUID(),
						content: gridContent.map((value: string) => ({
							id: crypto.randomUUID(),
							value,
						})),
					} as TSidebarContent;
				}
				// Grid items might already be objects but without IDs
				const migratedGrid = gridContent.map((gridItem: any) => {
					if (typeof gridItem === 'string') {
						return { id: crypto.randomUUID(), value: gridItem };
					}
					if (gridItem.id && typeof gridItem.id === 'string') {
						return gridItem;
					}
					return { id: crypto.randomUUID(), value: gridItem.value || '' };
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
	}));
}

/**
 * Adds IDs to main sections and content items if they don't have them
 */
export function migrateMainSection(sections: TMainSection[]): TMainSection[] {
	return sections.map((section) => {
		// Check if section already has an id (for backward compatibility)
		const sectionWithId = section as any;
		const sectionId = sectionWithId.id && typeof sectionWithId.id === 'string' ? section.id : crypto.randomUUID();
		
		return {
			...section,
			id: sectionId,
			content: section.content.map((item) => {
				// Check if item already has an id (for backward compatibility)
				const itemWithId = item as any;
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
