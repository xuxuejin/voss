import { ComponentStory, ComponentMeta } from '@storybook/react';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

import Input from './input';

library.add(fas)

export default {
    title: 'example/Input',
    component: Input,
} as ComponentMeta<typeof Input>;
  
const Template: ComponentStory<typeof Input> = (args) => <Input {...args} />;

export const Small = Template.bind({});
// Default.storyName = 'Small';
Small.args = { size: 'sm', placeholder: 'small' };

export const Large = Template.bind({});
// Default.storyName = 'large';
Large.args = { size: 'lg', placeholder: 'large' };

export const Disabled = Template.bind({});
Disabled.args = { placeholder: 'disabled', disabled: true };

export const Prepend = Template.bind({})
Prepend.args = { prepend: 'https://', placeholder: 'prepend' }

export const Append = Template.bind({})
Append.args = { append: '.com', placeholder: 'append'}

export const WithIcon = Template.bind({})
WithIcon.args = { placeholder: 'icon', icon: 'magnifying-glass'}