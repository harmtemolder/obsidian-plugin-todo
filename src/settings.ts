import { App, PluginSettingTab, Setting } from 'obsidian';
import type TodoPlugin from './main';

export const DEFAULT_SETTINGS: TodoPluginSettings = {
  groupTasks: false,
};

export interface TodoPluginSettings {
  groupTasks: boolean;
}

export class TodoPluginSettingTab extends PluginSettingTab {
  plugin: TodoPlugin;
  app: App;

  constructor(app: App, plugin: TodoPlugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.app = app;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Obsidian TODO | Text-based GTD' });
    containerEl.createEl('p', {
      text:
        'Collects all outstanding TODOs from your vault and presents them in lists Today, Scheduled, Inbox and Someday/Maybe.',
    });
    containerEl.createEl('h3', { text: 'General Settings' });

    new Setting(containerEl)
      .setName('Group tasks by source note')
      .setDesc('If enabled, tasks will be grouped by their source note. If disabled, they will be shown in one long list.')
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.groupTasks);
        toggle.onChange(async (value) => {
          this.plugin.settings.groupTasks = value;
          await this.plugin.saveSettings();
        });
      });
  }
}
