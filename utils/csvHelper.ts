// utils/csvHelper.ts
export const exportToCSV = async (
	data: any[],
	columns: { headerName: string; field: string }[],
	fileName: string = 'data.csv'
) => {
	try {
		// Dynamic import of PapaParse
		const Papa = await import('papaparse').then((module) => module.default);

		// Helper function to get nested values
		const getValueByPath = (obj: any, path: string) => {
			return path.split('.').reduce((acc, part) => acc && acc[part], obj);
		};

		// Prepare headers and extract rows based on fields
		const headers = columns.map((col) => col.headerName);
		const fields = columns.map((col) => col.field);

		const csvData = Papa.unparse({
			fields: headers,
			data: data.map((row) =>
				fields.map((field) => {
					const value = getValueByPath(row, field);
					return value !== null && value !== undefined ? value : '';
				})
			),
		});

		// Create a Blob from the CSV data
		const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);

		// Create a temporary link to trigger the download
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', fileName);
		document.body.appendChild(link);
		link.click();

		// Clean up by removing the link and revoking the object URL
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	} catch (error) {
		console.error('Error exporting data to CSV:', error);
		alert('Failed to export data. Please try again.');
	}
};
