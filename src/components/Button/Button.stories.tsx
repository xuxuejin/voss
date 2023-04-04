import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Button from './button';

export default {
    title: 'example/Button',
    component: Button,
    // 通过装饰起让按钮居中
    // decorators: [
    //     (Story) => (
    //         <div style={{display: 'flex', justifyContent: 'center'}}>
    //             <Story />
    //         </div>
    //     )
    // ]
    parameters: {
        docs: {
            description: {
                component: '简单 Button 组件',
            },
        },
    },
} as ComponentMeta<typeof Button>;
  
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.storyName = 'Default';
Default.args = { btnType: 'default', children: 'Default' };

export const Primary = Template.bind({});
Primary.args = { btnType: 'primary', onClick: action('button-click-primary'), children: 'Primary' };

export const Danger = Template.bind({});
Danger.args = { btnType: 'danger', onClick: action('button-click-danger'), children: 'Danger' };

Danger.parameters = {
    docs: {
        description: {
            story: 'Button ** danger Button **',
        },
    },
};

export const Link = Template.bind({});
Link.args = { btnType: 'link', href: 'https://dummyurl.com', children: 'Link' };

