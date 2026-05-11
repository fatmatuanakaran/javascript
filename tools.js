(function (global) {
  function resolveContainer(container) {
    return typeof container === 'string' ? document.querySelector(container) : container;
  }

  function clear(el) {
    el.textContent = '';
  }

  const ToolLibrary = {
    dateEdit(container, config = {}) {
      const el = resolveContainer(container);
      if (!el) return null;

      const input = document.createElement('input');
      input.type = 'date';
      if (config.value) input.value = config.value;

      clear(el);
      el.appendChild(input);
      return input;
    },

    comboBox(container, config = {}) {
      const el = resolveContainer(container);
      if (!el) return null;

      const select = document.createElement('select');
      const options = Array.isArray(config.options) ? config.options : [];

      options.forEach((option) => {
        const item = document.createElement('option');
        item.value = option;
        item.textContent = option;
        if (config.selected === option) item.selected = true;
        select.appendChild(item);
      });

      if (typeof config.onChange === 'function') {
        select.addEventListener('change', (event) => config.onChange(event.target.value));
      }

      clear(el);
      el.appendChild(select);
      return select;
    },

    dataGrid(container, config = {}) {
      const el = resolveContainer(container);
      if (!el) return null;

      const data = Array.isArray(config.data) ? config.data : [];
      const columns = Array.isArray(config.columns) && config.columns.length > 0
        ? config.columns
        : Object.keys(data[0] || {});

      const table = document.createElement('table');
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');

      columns.forEach((column) => {
        const th = document.createElement('th');
        th.textContent = column;
        headerRow.appendChild(th);
      });

      thead.appendChild(headerRow);
      table.appendChild(thead);

      const tbody = document.createElement('tbody');
      data.forEach((row) => {
        const tr = document.createElement('tr');
        columns.forEach((column) => {
          const td = document.createElement('td');
          td.textContent = row[column] ?? '';
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      clear(el);
      el.appendChild(table);
      return table;
    },

    pivotTable(container, config = {}) {
      const el = resolveContainer(container);
      if (!el) return null;

      const data = Array.isArray(config.data) ? config.data : [];
      const rowField = config.rowField;
      const valueField = config.valueField;
      const groups = {};

      data.forEach((row) => {
        const key = row[rowField];
        const value = Number(row[valueField]) || 0;
        groups[key] = (groups[key] || 0) + value;
      });

      const tableData = Object.entries(groups).map(([key, value]) => ({
        [rowField]: key,
        [valueField]: value,
      }));

      return this.dataGrid(el, {
        data: tableData,
        columns: [rowField, valueField],
      });
    },

    sidebar(container, config = {}) {
      const el = resolveContainer(container);
      if (!el) return null;

      const wrapper = document.createElement('nav');
      wrapper.className = 'sidebar';

      const title = document.createElement('h3');
      title.textContent = config.title || 'Menu';
      wrapper.appendChild(title);

      const list = document.createElement('ul');
      const items = Array.isArray(config.items) ? config.items : [];

      items.forEach((item) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = item.href || '#';
        link.textContent = item.label || item.href || 'Item';
        li.appendChild(link);
        list.appendChild(li);
      });

      wrapper.appendChild(list);

      clear(el);
      el.appendChild(wrapper);
      return wrapper;
    },
  };

  global.ToolLibrary = ToolLibrary;
})(window);
