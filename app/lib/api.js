const API_URL = 'https://sheetdb.io/api/v1/b1trlzrz5n1uu';

export const fetchData = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};

export const addData = async (data) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: [data] }),
  });
  if (!response.ok) {
    throw new Error('Failed to add data');
  }
  return response.json();
};

export const updateData = async (code, data) => {
  const response = await fetch(`${API_URL}/Codes/${code}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  });
  if (!response.ok) {
    throw new Error('Failed to update data');
  }
  return response.json();
};

export const deleteData = async (code) => {
  const response = await fetch(`${API_URL}/Codes/${code}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete data');
  }
  return response.json();
};
