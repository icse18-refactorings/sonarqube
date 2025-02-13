/*
 * SonarQube
 * Copyright (C) 2009-2018 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import $ from 'jquery';
import React from 'react';
import { render } from 'react-dom';
import BaseView from './base-viewer-view';
import SourceViewer from '../../SourceViewer/SourceViewer';
import Template from '../templates/workspace-viewer.hbs';
import WithStore from '../../shared/WithStore';

export default BaseView.extend({
  template: Template,

  onRender() {
    BaseView.prototype.onRender.apply(this, arguments);
    this.showViewer();
  },

  scrollToLine(line) {
    const row = this.$el.find(`.source-line[data-line-number="${line}"]`);
    if (row.length > 0) {
      const sourceViewer = this.$el.find('.source-viewer');
      let p = sourceViewer.scrollParent();
      if (p.is(document) || p.is('body')) {
        p = $(window);
      }
      const pTopOffset = p.offset() != null ? p.offset().top : 0;
      const pHeight = p.height();
      const goal = row.offset().top - pHeight / 3 - pTopOffset;
      p.scrollTop(goal);
    }
  },

  showViewer() {
    const { branchLike, key, line } = this.model.toJSON();

    const el = document.querySelector(this.viewerRegion.el);

    render(
      <WithStore>
        <SourceViewer
          aroundLine={line}
          branchLike={branchLike}
          component={key}
          fromWorkspace={true}
          highlightedLine={line}
          onLoaded={component => {
            this.model.set({ name: component.name, q: component.q });
            if (line) {
              this.scrollToLine(line);
            }
          }}
        />
      </WithStore>,
      el
    );
  }
});
