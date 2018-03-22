import { GraphicsEx } from '../graphicsex';

describe('GraphicsEx', () => {
    it('div', () => {
        const cmds = GraphicsEx.parseCommands('M 100,200 C 100,25 400,350 400,175 H 280');
        expect(cmds.length).toBe(3);
    });
 });
