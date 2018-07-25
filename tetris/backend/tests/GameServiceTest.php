<?php

namespace App\Tests;

use App\Entity\Board;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use App\Service\GameService;

class GameServiceTest extends WebTestCase
{

    private $serv;
    private $secret = 'def000004ba8fee5d13ac2b2d8f13d3762bd732df2513df86da00f96da48c36623de3fe1bd45d0e63b82066fe31ccd1f090883d60312c989cd4893797b143c4a33495263';

    public function setUp(){
        $client = static::createClient();
        $container = $client->getContainer();
        $doctrine = $container->get('doctrine');
        $entityManager = $doctrine->getManager();
        $this->serv = new GameService($entityManager, $this->secret);
    }

    public function testgameVictory()
    {
/*        
        for($i=0; $i<9;$i++)
        {
            $tablero[$i]=null;
        }
*/      
        $tablero= new Board();
 
        $pos=[];
        $pos[0]=null;
        $pos[1]=null;
        $pos[2]=0;

        $pos[3]=0;
        $pos[4]=null;
        $pos[5]=null;

        $pos[6]=null;
        $pos[7]='x';
        $pos[8]=null;

        $tablero->setPositions($pos);

        $p = $this->serv->gameVictory($tablero);
        $this->assertEquals( [ ] , $p);
    }
}